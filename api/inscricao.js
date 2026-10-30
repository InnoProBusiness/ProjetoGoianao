// Recebe o formulário da imersão e envia por e-mail via Resend.
// Variáveis de ambiente na Vercel:
//   RESEND_API_KEY (obrigatória)
//   RESEND_FROM    (opcional, remetente de um domínio verificado no Resend)
//   TO_EMAIL       (opcional, padrão innoprobusiness@gmail.com)

const esc = (v) =>
  String(v == null ? "" : v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const LABELS = {
  tipo: "Tipo",
  nome: "Nome",
  email: "E-mail",
  whatsapp: "WhatsApp",
  igreja: "Igreja / denominação",
  pastor: "Pastor ou líder",
  confirmaIgreja: "Participa da igreja 1x por semana",
  posicao: "Posição",
  aceite: "Aceita o projeto",
  contribuicao: "Forma de contribuição",
  valor: "Valor mensal (R$)",
  servico: "Serviço oferecido",
  dias: "Dias disponíveis",
  horas: "Horas por semana",
  cenario: "Cenário preferido",
  nomeClube: "Nome preferido",
  mensagem: "Mensagem",
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Método não permitido" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot anti-spam
  if (body.site) return res.status(200).json({ ok: true });

  const required = ["nome", "email", "whatsapp", "igreja"];
  for (const k of required) {
    if (!body[k] || String(body[k]).trim().length < 2) {
      return res.status(400).json({ ok: false, error: `Campo obrigatório: ${LABELS[k]}` });
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email))) {
    return res.status(400).json({ ok: false, error: "E-mail inválido" });
  }
  if (!body.consentimento) {
    return res.status(400).json({ ok: false, error: "É preciso aceitar o uso dos dados" });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return res.status(503).json({ ok: false, error: "Envio ainda não configurado" });
  }

  const to = process.env.TO_EMAIL || "innoprobusiness@gmail.com";
  const from = process.env.RESEND_FROM || "Projeto Sons Church <contato@innoprobusiness.com.br>";
  const tipo = body.tipo === "apoiador" ? "Apoiador" : "Jogador";

  const rows = Object.keys(LABELS)
    .filter((k) => body[k] != null && String(body[k]).trim() !== "")
    .map((k) => {
      const v = Array.isArray(body[k]) ? body[k].join(", ") : body[k];
      return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;white-space:nowrap">${esc(LABELS[k])}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111"><b>${esc(v)}</b></td></tr>`;
    })
    .join("");

  const html = `<div style="font-family:Arial,sans-serif;max-width:600px">
<h2 style="margin:0 0 4px">Nova adesão ao projeto — ${esc(tipo)}</h2>
<p style="margin:0 0 16px;color:#666">Enviado pela imersão Sons Church em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</p>
<table style="border-collapse:collapse;width:100%;font-size:14px">${rows}</table>
<p style="color:#999;font-size:12px;margin-top:16px">A pessoa autorizou Leonardo Mendes, fundador do projeto, a usar estes dados para contato sobre o projeto (LGPD).</p></div>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: String(body.email),
        subject: `[Sons Church] ${tipo}: ${String(body.nome).slice(0, 80)}`,
        html,
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      console.error("Resend error", r.status, t);
      return res.status(502).json({ ok: false, error: "Falha no envio" });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "Erro inesperado" });
  }
};

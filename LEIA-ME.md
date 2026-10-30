# Sons Church FC — landing page

## Estrutura
- `index.html` — a landing page (rolagem contínua, todas as seções da imersão)
- `apresentacao.html` — a mesma imersão em modo carrossel, em `/apresentacao`
- `img/` — foto do time, uniformes, colete, logo e escudo C.R.S.C
- `fonts/` — fontes da identidade (Barlow Condensed, Barlow e Permanent Marker), hospedadas junto com o site
- `api/inscricao.js` — função da Vercel que envia o formulário por e-mail via Resend

## Publicar (GitHub + Vercel)
1. Suba o conteúdo desta pasta para um repositório no GitHub.
2. Na Vercel: Add New → Project → importe o repositório. Framework: **Other**. Sem build.
3. Em Settings → Deployment Protection, desligue a *Vercel Authentication*. Sem isso, quem abrir o link cai numa tela de login.

## Envio do formulário (Resend)
Em Settings → Environment Variables:

| Nome | Valor |
|---|---|
| `RESEND_API_KEY` | chave do Resend (a mesma do site da InnoPro serve) |
| `RESEND_FROM` | remetente de domínio verificado, ex.: `Projeto Sons Church <contato@innoprobusiness.com.br>` |
| `TO_EMAIL` | opcional — padrão `innoprobusiness@gmail.com` |

Depois, faça um Redeploy.

## Imagens
Todas as imagens (Nilston, uniformes, redes, site e elenco) já estão em `img/`. Para trocar uma, substitua o arquivo mantendo o mesmo nome.

## Navegação
- Menu fixo no topo com as seções principais e o botão "Quero fazer parte" (leva ao formulário).
- No celular e tablet, o botão "Menu" abre a lista de todas as seções.
- Cada seção tem link próprio, por exemplo `/#socio-torcedor` ou `/#sim`.
- Links antigos do carrossel (`/#slide-12`) continuam abrindo a seção certa.
- O modo apresentação continua em `/apresentacao`.

## Identidade visual
| Elemento | Definição |
|---|---|
| Emblema | Escudo C.R.S.C (leão coroado) · nome Sons Church FC |
| Preto | `#0B0B0B` fundo principal |
| Branco | `#F4F2EC` texto e slides claros |
| Dourado | `#D4A946` destaques, botões, números · no máximo ~10% da tela |
| Títulos | Barlow Condensed 800, caixa alta |
| Frase de impacto | Permanent Marker em dourado · uma por slide, no máximo |
| Texto | Barlow 400–700 |
| Tom | Épico com propósito: fotos escuras com luz dourada, números e regras em slides claros |

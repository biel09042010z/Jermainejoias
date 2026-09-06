# Jermaine Joias — site + painel admin

## O que mudou
- O site (`index.html`) não tem mais os produtos "fixos" no código nem a senha do admin exposta no HTML. Agora ele busca as peças em `/api/produtos` e o checkout ("Finalizar compra") envia o pedido para `/api/pedidos`.
- `admin.html` é o painel (mesmo modelo usado nos outros sites), com login e abas **Peças** e **Pedidos**, conectado ao mesmo banco.
- Toda a persistência é feita em um banco **Neon Postgres**, acessado por funções serverless em `/api` (rodando na Vercel).

## Passo a passo para colocar no ar

### 1. Criar o banco no Neon
1. Crie um projeto novo em [neon.tech](https://neon.tech) (ex: "Jermaine Joias").
2. Abra o **SQL Editor** do projeto e rode o conteúdo do arquivo `schema.sql` (cria as tabelas `produtos` e `pedidos`).
3. Em "Connection Details", copie a **connection string** (algo como `postgres://usuario:senha@ep-xxxxx.neon.tech/neondb?sslmode=require`).

### 2. Subir o projeto para o GitHub
Suba esta pasta inteira (`index.html`, `admin.html`, `api/`, `package.json`, `schema.sql`) para um repositório novo.

### 3. Importar na Vercel
1. Importe o repositório na Vercel.
2. Em **Settings → Environment Variables**, adicione:
   - `DATABASE_URL` → a connection string do Neon.
   - `ADMIN_EMAIL` → `joaogabrielsantoshilario05@gmail.com`
   - `ADMIN_PASSWORD` → `09042010`
   - `AUTH_SECRET` → qualquer string longa e aleatória (só para assinar o login).
3. Faça o deploy.

### 4. Cadastrar as peças
Acesse `seusite.vercel.app/admin.html`, entre com o e-mail e senha de sempre, e cadastre as peças na aba **Peças**. Elas aparecem automaticamente na home do site assim que forem salvas com "Visível no site" marcado.

## Sobre os pedidos
Quando alguém clica em "Finalizar compra" no site, o pedido é gravado no banco e aparece na aba **Pedidos** do painel — ainda não há um passo de pagamento online; é um registro do que o cliente quer comprar, para você dar continuidade (WhatsApp, PIX etc.), assim como nos outros painéis que você já usa.

## Observações
- Trocamos os ícones/gráficos SVG de cada peça (que eram fixos no código) por foto real via **URL da foto** no formulário — assim dá para gerenciar tudo pelo painel, sem mexer em código.
- Os contadores de peças nas categorias da home (ex. "42 peças") já estavam ocultos no CSS original — não reativamos, mas se quiser que mostrem a contagem real, é só avisar.

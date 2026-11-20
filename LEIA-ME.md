# Site Gilberto Gomes · gibagg.com.br

Site estático (HTML + CSS), sem build e sem dependências.

## Estrutura
- `index.html` Início · `artigos.html` · `series.html` · `sobre.html`
- `artigo-*.html` um arquivo por artigo (publicados e "em breve")
- `assets/` estilo, fotos e imagem de compartilhamento
- `CNAME` já com o domínio `gibagg.com.br` · `sitemap.xml` · `robots.txt`

## Publicar de graça no GitHub Pages
1. Crie uma conta no github.com e um repositório **público** (ex.: `site`).
2. Envie todos os arquivos desta pasta para a raiz do repositório (Add file > Upload files).
3. Em Settings > Pages: Source = "Deploy from a branch", Branch = `main`, pasta `/ (root)`. Em "Custom domain" digite `gibagg.com.br` e salve.

## Ligar o domínio (Registro.br)
No painel do Registro.br, em gibagg.com.br > DNS > Editar zona (modo avançado), crie:
- 4 registros **A** para o domínio raiz (nome vazio ou `@`):
  185.199.108.153 · 185.199.109.153 · 185.199.110.153 · 185.199.111.153
- 1 registro **CNAME** com nome `www` apontando para `SEUUSUARIO.github.io.`

A propagação leva de minutos a algumas horas. Depois, em Settings > Pages do GitHub, marque **Enforce HTTPS**.

## Novo artigo
Duplique um `artigo-*.html`, troque título, texto e metadados e adicione o cartão em `index.html`, `artigos.html` e `series.html`.

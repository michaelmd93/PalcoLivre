# PalcoLivre

Marketplace de serviços musicais que conecta músicos, bandas e cantores a
contratantes, com foco inicial em **Lorena e Guaratinguetá (SP)**.

Projeto acadêmico — FATEC Guaratinguetá · Gestão da Tecnologia da Informação.

## Status do projeto

**Etapa 2.2 (atual): refinamento estético da interface** — sistema de temas
visuais, correções de contraste, acessibilidade e polimento geral da UI.

Histórico de etapas:

| Etapa | Descrição | Status |
|-------|-----------|--------|
| 1 | Interface inicial — HTML/CSS/JS puro, dados demo locais | ✅ Concluída |
| 2 | Aprimoramento visual, fotos nos cards, busca/filtros e responsividade | ✅ Concluída |
| 2.1 | Sistema de temas visuais (Palco Noturno e Palco Claro) | ✅ Concluída |
| 2.2 | Refinamento estético final — contraste, tipografia, cards e hero | ✅ Concluída |
| 3 | Back-end com Node.js + Express (API REST) | Pendente |
| 4 | Banco MySQL + Sequelize (artistas, contratantes, categorias) | Pendente |
| 5 | Autenticação e cadastro real | Pendente |
| 6 | Contato/negociação entre contratante e artista | Pendente |

## Como visualizar localmente

O front-end não depende de build nem de servidor. Duas opções:

**Opção 1 — abrir direto no navegador**

Dê dois cliques em `frontend/index.html`.

**Opção 2 — servidor local (recomendado para testar fotos e temas)**

```powershell
powershell -ExecutionPolicy Bypass -File scripts\serve.ps1
```

Depois acesse <http://localhost:8080>. Para outra porta: `-Porta 3000`.

> As fotos dos cards vêm do Unsplash (internet necessária). Sem conexão, o
> card exibe o avatar de iniciais como fallback automático.
>
> Na etapa de back-end, o Express passará a servir a pasta `frontend/`
> como conteúdo estático — a estrutura já foi pensada para isso.

## Sistema de temas visuais

A interface oferece dois temas que o usuário pode alternar pelo botão ☀/🌙
no cabeçalho, disponível em computadores e dispositivos móveis.

### Palco Noturno (padrão)

Fundo preto/roxo profundo com acentos em roxo, violeta e rosa. Identidade
musical moderna, elegante e adequada para ambientes com pouca luz.

### Palco Claro

Fundo branco/cinza-lavanda com superfícies claras e textos escuros. Mantém
o roxo como cor principal da marca, com gradientes discretos.

### Comportamento técnico

| Recurso | Implementação |
|---------|---------------|
| Persistência | `localStorage` — a preferência é salva e restaurada a cada visita |
| Primeira visita | Detecta `prefers-color-scheme` do sistema operacional; usa o tema correspondente se não houver preferência salva |
| Sem flash inicial | Script inline no `<head>` aplica `data-tema` no `<html>` **antes** dos arquivos CSS serem carregados, eliminando o piscar do tema errado |
| Troca com animação | Classe `.tema-transicao` ativa transições de 280 ms nas cores durante a troca manual; não dispara na carga inicial |
| Acessibilidade | Botão tem `aria-label` dinâmico ("Mudar para tema claro" / "Mudar para tema noturno"); ícone muda entre sol e lua |

### Onde as cores são definidas

- **`css/tokens.css`** — todas as variáveis CSS de cor em `:root` (Palco Noturno) e no bloco `[data-tema="claro"]` (Palco Claro). Para ajustar a paleta, edite somente este arquivo.
- **`css/styles.css`** — estilos estruturais dos componentes; não contém cores hardcoded.
- **`js/main.js`** — funções `iniciarTema()`, `aplicarTema()` e `atualizarBotaoTema()`.

## Estrutura

```
Projeto/
├── frontend/
│   ├── index.html            Página inicial (estrutura, SVG sprite, script anti-flash)
│   ├── css/
│   │   ├── tokens.css        Cores, fontes e medidas — ambos os temas centralizados aqui
│   │   └── styles.css        Estilos dos componentes (~1 040 linhas)
│   ├── js/
│   │   ├── config.js         Nome da marca, tagline, cidades, contato
│   │   ├── data.js           Dados demo (artistas c/ fotos, categorias)
│   │   └── main.js           Busca, filtros, modais, menu, temas e animações
│   └── assets/
│       ├── hero-palco.svg    Ilustração do palco (hero)
│       └── favicon.svg       Ícone do site
├── scripts/
│   └── serve.ps1             Servidor estático local (opcional, Windows/PowerShell)
├── .gitignore
└── README.md
```

## Funcionalidades testadas

### Busca e filtros

| Funcionalidade | Método de teste | Resultado |
|----------------|-----------------|-----------|
| Busca por nome | Evento `input` com debounce 280 ms e normalização NFD | OK |
| Busca por instrumento | Campos buscados em `artistaCorresponde` | OK |
| Filtro por cidade | Evento `change` + lógica de região | OK |
| Filtro por categoria | Toggle + `aria-pressed` + scroll suave | OK |
| Busca + categoria simultâneos | Lógica AND em `artistaCorresponde` | OK |
| Limpar filtros | `btn-limpar` e `data-limpar` | OK |
| Estado vazio | Mensagem e botão de reset | OK |

### Modais e navegação

| Funcionalidade | Método de teste | Resultado |
|----------------|-----------------|-----------|
| Modal "Entrar" | `data-modal` e conteúdo do modal | OK |
| Modal "Cadastrar" | `data-modal` e conteúdo do modal | OK |
| Modal perfil de artista | `data-artista` e dados renderizados | OK |
| Fechar modal (X, overlay, Esc) | `data-fechar-modal` e keydown | OK |
| Retorno de foco ao fechar | `ultimoFoco?.focus?.()` com proteção de encadeamento | OK |
| Menu móvel (hambúrguer) | Toggle, `aria-expanded`, fechamento | OK |
| Navegação por âncoras | Todos os `href="#..."` do HTML | OK |

### Sistema de temas

| Funcionalidade | Método de teste | Resultado |
|----------------|-----------------|-----------|
| Alternância Noturno ↔ Claro | Clique no botão ☀/🌙 | OK |
| Persistência após recarregar | `localStorage.getItem/setItem` | OK |
| Preferência do sistema operacional | `prefers-color-scheme` na primeira visita | OK |
| Ausência de flash inicial | Script anti-flash posicionado antes dos CSS links | OK |
| Transição animada na troca manual | Classe `.tema-transicao` com 280 ms | OK |
| Sem animação (prefers-reduced-motion) | `@media (prefers-reduced-motion)` anula transições | OK |
| Botão visível em mobile | `.btn-tema` fora de `.acoes-topo` (que oculta em 900px) | OK |

### Responsividade

| Breakpoint | Comportamento | Resultado |
|------------|---------------|-----------|
| 1024px (tablet) | Hero em 1 coluna, visual centralizado | OK |
| 768px | Passos em 1 coluna | OK |
| 720px | Busca e CTAs em 1 coluna | OK |
| 520px | Categorias 2 colunas, rodapé 1 coluna | OK |

## Decisões técnicas (para apresentação)

- **Sem frameworks**: o projeto usa HTML/CSS/JS puros. Todo o comportamento
  (busca, filtros, modal, menu, temas) é feito com JavaScript nativo —
  sem jQuery, React ou Vue.
- **Identidade centralizada**: cores e fontes ficam em `css/tokens.css`
  (variáveis CSS); o nome da marca e dados institucionais ficam em
  `js/config.js`. Rebatizar o produto não exige buscar e trocar no código.
- **Dois temas, zero duplicação de CSS**: o Palco Claro sobrescreve apenas
  as variáveis de cor em `[data-tema="claro"]`. Tipografia, grid, espaçamentos
  e lógica de componentes são idênticos nos dois temas.
- **Sem flash de tema**: o atributo `data-tema` é definido por um script
  inline no `<head>`, antes do carregamento dos arquivos CSS. O navegador
  já conhece o tema correto antes de pintar qualquer pixel.
- **Dados demo em JS, não em JSON**: os artistas ilustrativos estão em
  `data.js` carregado por `<script>`. Assim a página funciona até abrindo
  o arquivo direto (protocolo `file://`), onde `fetch()` a arquivos locais
  seria bloqueado pelo navegador.
- **Fotos com fallback graceful**: se a imagem do Unsplash não carregar,
  o `onerror` remove o `<img>` e o avatar de iniciais aparece automaticamente.
- **Busca sem acentos**: `normalizar()` usa `NFD + \u0300-\u036f` para
  remover diacríticos. "violao" encontra "Violão" e vice-versa.
- **Selo "Demonstração"**: nenhum perfil fictício é apresentado como
  usuário real — cada card e a seção de artistas trazem aviso explícito.
- **Todo botão tem função definida**: ações que dependem de back-end
  (entrar, cadastrar, contato) abrem um modal explicando em qual etapa
  serão implementadas.
- **Acessibilidade**: HTML semântico, `label` nos campos, `aria-*` em
  menu/modal/resultados, foco visível e respeito a `prefers-reduced-motion`.

## Observações

- Nenhuma credencial, senha ou token é utilizada nesta etapa.
- O e-mail de contato no rodapé é um marcador de posição (`config.js`).
- As fotos usam a CDN pública do Unsplash (gratuita para protótipos e demos
  acadêmicas; na versão de produção devem ser hospedadas no próprio servidor).
- O script `scripts/serve.ps1` é uma ferramenta auxiliar de desenvolvimento
  para Windows com PowerShell. Não é uma dependência do projeto — a página
  funciona abrindo `frontend/index.html` diretamente no navegador.

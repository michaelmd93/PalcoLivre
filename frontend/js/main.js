/* ============================================================
   PALCOLIVRE — Lógica da página inicial
   ------------------------------------------------------------
   Responsável por:
   - aplicar nome/marca a partir de config.js
   - renderizar categorias, artistas (dados demo de data.js)
     e os passos da seção "Como funciona"
   - busca com filtro por texto, cidade e categoria
   - modais (entrar / cadastrar / perfil do artista)
   - menu móvel e animações de rolagem
   ============================================================ */

"use strict";

/* ---------- Atalhos ---------- */
const $ = (seletor, el = document) => el.querySelector(seletor);
const $$ = (seletor, el = document) => [...el.querySelectorAll(seletor)];

/* Proteção simples contra HTML injetado ao montar strings. */
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const icone = (nome) =>
  `<svg class="icone" aria-hidden="true"><use href="#ic-${nome}"/></svg>`;

/* ---------- Estado dos filtros ---------- */
const estado = { texto: "", cidade: "", categoria: null };
let timerEsqueleto = null;
let ultimoFoco = null;

/* ============================================================
   Inicialização
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  iniciarTema();       /* sincroniza UI do botão com o tema já aplicado pelo anti-flash */
  aplicarMarca();
  preencherCidades();
  renderCategorias();
  renderPassos();
  renderArtistas();
  vincularEventos();
  observarRolagem();
  $("#ano-atual").textContent = new Date().getFullYear();
});

/* Aplica nome e contato definidos em config.js. */
function aplicarMarca() {
  document.title = `${SITE_CONFIG.nome} — ${SITE_CONFIG.tagline}`;
  $$("[data-marca]").forEach((el) => (el.textContent = SITE_CONFIG.nome));
  $("[data-instituicao]").textContent = SITE_CONFIG.instituicao;

  const link = $("#link-contato");
  link.href = `mailto:${SITE_CONFIG.emailContato}`;
  $("#email-contato").textContent = SITE_CONFIG.emailContato;
}

/* Preenche o <select> de cidades com as opções da config. */
function preencherCidades() {
  $("#busca-cidade").innerHTML = SITE_CONFIG.cidades
    .map((c) => `<option value="${esc(c.valor)}">${esc(c.rotulo)}</option>`)
    .join("");
}

/* ============================================================
   Categorias
   ============================================================ */
function renderCategorias() {
  $("#lista-categorias").innerHTML = CATEGORIAS.map(
    (c) => `
    <button class="cat-card revela" type="button" data-categoria="${esc(c.nome)}"
            aria-pressed="false">
      <span class="cat-icone">${icone(c.icone)}</span>
      <strong>${esc(c.nome)}</strong>
      <span>${esc(c.desc)}</span>
    </button>`
  ).join("");
}

/* ============================================================
   Passos ("Como funciona")
   ============================================================ */
function renderPassos() {
  $("#lista-passos").innerHTML = PASSOS.map(
    (p, i) => `
    <article class="passo revela">
      <span class="passo-num" aria-hidden="true">${i + 1}</span>
      <span class="passo-icone">${icone(p.icone)}</span>
      <h3>${esc(p.titulo)}</h3>
      <p>${esc(p.texto)}</p>
    </article>`
  ).join("");
}

/* ============================================================
   Artistas: filtro + renderização
   ============================================================ */
function normalizar(s) {
  /* Remove marcas diacríticas (acentos) após decomposição NFD.
     A faixa U+0300–U+036F cobre todos os combinadores comuns. */
  return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function artistaCorresponde(a) {
  if (estado.categoria && !a.estilos.includes(estado.categoria)) return false;

  if (estado.cidade) {
    const opcao = SITE_CONFIG.cidades.find((c) => c.valor === estado.cidade);
    /* Opção de "região" abrange todas as cidades cadastradas. */
    if (!opcao?.regiao && a.cidade !== estado.cidade) return false;
  }

  if (estado.texto) {
    const campos = normalizar(
      [a.nome, a.tipo, a.formato, a.cidade, ...a.estilos, ...a.instrumentos].join(" ")
    );
    if (!campos.includes(normalizar(estado.texto))) return false;
  }
  return true;
}

const iniciais = (nome) =>
  nome.split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

function cartaoArtista(a) {
  /* A foto vem do campo `foto` em data.js (URL Unsplash).
     Se não carregar (sem internet), o onerror remove o <img> e
     o avatar de iniciais, que está por baixo, torna-se visível. */
  const fotoTag = a.foto
    ? `<img class="cartao-foto" src="${a.foto}" alt="Foto demonstrativa de ${esc(a.nome)}" loading="lazy" onerror="this.remove()">`
    : "";

  return `
  <article class="cartao revela" style="--h:${a.cor}">
    <div class="cartao-topo">
      ${fotoTag}
      <span class="badge-demo">Demonstração</span>
      <span class="avatar" aria-hidden="true">${esc(iniciais(a.nome))}</span>
    </div>
    <div class="cartao-corpo">
      <h3>${esc(a.nome)}</h3>
      <p class="cartao-tipo">${esc(a.tipo)}</p>
      <div class="chips">${a.estilos.map((e) => `<span class="chip">${esc(e)}</span>`).join("")}</div>
      <div class="cartao-meta">
        <span class="cidade">${icone("pin")} ${esc(a.cidade)}</span>
        <span class="formato">${esc(a.formato)}</span>
      </div>
      <button class="botao botao--linha" type="button" data-artista="${a.id}">Ver perfil</button>
    </div>
  </article>`;
}

function cartaoEsqueleto() {
  return `
  <div class="esqueleto" aria-hidden="true">
    <div class="esq esq-topo"></div>
    <div class="esq esq-avatar"></div>
    <div class="esq esq-linha"></div>
    <div class="esq esq-linha curta"></div>
    <div class="esq esq-linha"></div>
    <div class="esq esq-botao"></div>
  </div>`;
}

function estadoVazio() {
  const porCategoria = estado.categoria
    ? `Ainda não há artistas de <strong>${esc(estado.categoria)}</strong> cadastrados — no lançamento, esta categoria estará aberta para novos cadastros.`
    : "Tente ajustar o termo da busca ou escolher outra cidade.";

  return `
  <div class="estado-vazio">
    ${icone("busca")}
    <h3>Nenhum artista encontrado</h3>
    <p>${porCategoria}</p>
    <button class="botao botao--fantasma" type="button" data-limpar>Limpar filtros</button>
  </div>`;
}

function atualizarContagem(filtrados) {
  const ativo = estado.texto || estado.cidade || estado.categoria;
  const total = ARTISTAS_DEMO.length;
  $("#contagem-resultados").innerHTML = ativo
    ? `<strong>${filtrados.length}</strong> de ${total} artistas (demonstração)`
    : `${total} artistas cadastrados <strong>(demonstração)</strong>`;
  $("#btn-limpar").classList.toggle("visivel", Boolean(ativo));
}

function renderArtistas() {
  const grade = $("#lista-artistas");
  clearTimeout(timerEsqueleto);

  /* Breve estado de carregamento para demonstrar o feedback visual. */
  grade.setAttribute("aria-busy", "true");
  grade.innerHTML = cartaoEsqueleto().repeat(6);

  timerEsqueleto = setTimeout(() => {
    const filtrados = ARTISTAS_DEMO.filter(artistaCorresponde);
    grade.innerHTML = filtrados.length
      ? filtrados.map(cartaoArtista).join("")
      : estadoVazio();
    grade.setAttribute("aria-busy", "false");
    atualizarContagem(filtrados);
    observarNovos(grade);
    marcarCategoriaAtiva();
  }, 380);
}

function marcarCategoriaAtiva() {
  $$(".cat-card").forEach((el) => {
    const ativa = el.dataset.categoria === estado.categoria;
    el.classList.toggle("ativa", ativa);
    el.setAttribute("aria-pressed", String(ativa));
  });
}

function limparFiltros() {
  estado.texto = "";
  estado.cidade = "";
  estado.categoria = null;
  $("#busca-texto").value = "";
  $("#busca-cidade").value = "";
  renderArtistas();
}

/* ============================================================
   Modal
   ============================================================ */
function htmlModalAuth(tipo) {
  const entrar = tipo === "entrar";
  return `
    <div class="modal-icone">${icone(entrar ? "users" : "spark")}</div>
    <h3 id="modal-titulo">${entrar ? "Entrar na sua conta" : "Criar sua conta"}</h3>
    <p class="modal-texto">
      ${entrar
        ? "A área de login será implementada na etapa de back-end do projeto (Node.js + MySQL), com autenticação segura."
        : "O cadastro de contratantes e músicos será implementado na etapa de back-end do projeto (Node.js + MySQL)."}
      Enquanto isso, todos os perfis públicos já podem ser explorados livremente.
    </p>
    <button class="botao botao--primario" type="button" data-ir-artistas>
      Explorar artistas
      ${icone("seta")}
    </button>
    <p class="modal-nota">Protótipo acadêmico — nenhum dado é coletado nesta etapa.</p>`;
}

function htmlModalArtista(a) {
  /* Banner de foto no topo do modal (mesma lógica de fallback do card). */
  /* O div tem --h para que o gradiente de fallback use a cor do artista.
     Se a imagem falhar, o onerror remove o div inteiro (gradiente substituí). */
  const banner = a.foto
    ? `<div class="perfil-banner" style="--h:${a.cor}" aria-hidden="true">
         <img src="${a.fotoModal || a.foto}" alt="" loading="lazy" onerror="this.parentElement.remove()">
       </div>`
    : "";

  return `
    ${banner}
    <div class="perfil-topo">
      <span class="perfil-avatar" style="--h:${a.cor}" aria-hidden="true">${esc(iniciais(a.nome))}</span>
      <div>
        <h3 id="modal-titulo">${esc(a.nome)}</h3>
        <p class="perfil-tipo">${esc(a.tipo)} · ${esc(a.formato)}</p>
        <span class="cidade">${icone("pin")} ${esc(a.cidade)} — ${esc(a.cache)}</span>
      </div>
    </div>

    <div class="perfil-grupo">
      <h5>Estilos</h5>
      <div class="chips">${a.estilos.map((e) => `<span class="chip">${esc(e)}</span>`).join("")}</div>
    </div>
    <div class="perfil-grupo">
      <h5>Instrumentos</h5>
      <div class="chips">${a.instrumentos.map((e) => `<span class="chip">${esc(e)}</span>`).join("")}</div>
    </div>
    <div class="perfil-grupo">
      <h5>Sobre</h5>
      <p>${esc(a.bio)}</p>
    </div>

    <div class="perfil-aviso">
      ${icone("info")}
      <span>Perfil demonstrativo. Para entrar em contato com artistas reais será necessário criar uma conta — funcionalidade prevista para a próxima etapa.</span>
    </div>
    <button class="botao botao--primario" type="button" data-modal="cadastrar">
      Criar conta para contato
      ${icone("seta")}
    </button>`;
}

function abrirModal(conteudoHtml) {
  /* Só grava o foco de origem quando o modal está fechado.
     Se já está aberto (ex.: trocar do perfil para o cadastro),
     mantém o ultimoFoco original para o retorno correto ao fechar. */
  if ($("#modal").hidden) {
    ultimoFoco = document.activeElement;
  }
  $("#modal-conteudo").innerHTML = conteudoHtml;
  const modal = $("#modal");
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  $(".modal-caixa", modal).focus();
}

function fecharModal() {
  $("#modal").hidden = true;
  document.body.style.overflow = "";
  ultimoFoco?.focus?.();
}

/* ============================================================
   Eventos
   ============================================================ */
function vincularEventos() {
  const form = $("#form-busca");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    estado.texto = $("#busca-texto").value.trim();
    estado.cidade = $("#busca-cidade").value;
    renderArtistas();
    $("#artistas").scrollIntoView({ behavior: "smooth" });
  });

  /* Busca dinâmica enquanto digita (com pequena pausa). */
  let debounce;
  $("#busca-texto").addEventListener("input", (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      estado.texto = e.target.value.trim();
      renderArtistas();
    }, 280);
  });

  $("#busca-cidade").addEventListener("change", (e) => {
    estado.cidade = e.target.value;
    renderArtistas();
  });

  /* Cliques delegados: categorias, "ver perfil", limpar, modais. */
  document.addEventListener("click", (e) => {
    const cat = e.target.closest("[data-categoria]");
    if (cat) {
      estado.categoria = estado.categoria === cat.dataset.categoria ? null : cat.dataset.categoria;
      renderArtistas();
      $("#artistas").scrollIntoView({ behavior: "smooth" });
      return;
    }

    const btnPerfil = e.target.closest("[data-artista]");
    if (btnPerfil) {
      const artista = ARTISTAS_DEMO.find((a) => a.id === Number(btnPerfil.dataset.artista));
      if (artista) abrirModal(htmlModalArtista(artista));
      return;
    }

    if (e.target.closest("[data-limpar]") || e.target.closest("#btn-limpar")) {
      limparFiltros();
      return;
    }

    const btnModal = e.target.closest("[data-modal]");
    if (btnModal) {
      abrirModal(htmlModalAuth(btnModal.dataset.modal));
      fecharMenuMovel();
      return;
    }

    if (e.target.closest("[data-fechar-modal]")) {
      fecharModal();
      return;
    }

    if (e.target.closest("[data-ir-artistas]")) {
      fecharModal();
      $("#artistas").scrollIntoView({ behavior: "smooth" });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      fecharModal();
      fecharMenuMovel();
    }
  });

  /* Menu móvel */
  const btnMenu = $(".btn-menu");
  btnMenu.addEventListener("click", () => {
    const menu = $("#menu-movel");
    const aberto = menu.classList.toggle("aberto");
    btnMenu.setAttribute("aria-expanded", String(aberto));
    btnMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });
  $$("#menu-movel a").forEach((a) => a.addEventListener("click", fecharMenuMovel));

  /* Alternância de tema */
  $("#btn-tema").addEventListener("click", () => {
    const atual = document.documentElement.getAttribute("data-tema") || "noturno";
    aplicarTema(atual === "noturno" ? "claro" : "noturno");
  });

  /* Sombra do cabeçalho ao rolar */
  const topo = $(".topo-site");
  addEventListener("scroll", () => topo.classList.toggle("rolado", scrollY > 8), { passive: true });
}

function fecharMenuMovel() {
  $("#menu-movel").classList.remove("aberto");
  const btn = $(".btn-menu");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-label", "Abrir menu");
}

/* ============================================================
   Animação de entrada ao rolar (IntersectionObserver)
   ============================================================ */
const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("visivel");
        observador.unobserve(en.target);
      }
    });
  },
  { threshold: 0.12 }
);

function observarNovos(raiz = document) {
  $$(".revela:not(.visivel)", raiz).forEach((el) => observador.observe(el));
}

function observarRolagem() {
  observarNovos(document);
}

/* ============================================================
   Sistema de temas — Palco Noturno / Palco Claro
   ------------------------------------------------------------
   O atributo data-tema no elemento <html> é o único ponto de
   verdade. O script anti-flash no <head> o define antes do CSS,
   evitando qualquer piscar de tema errado.
   ============================================================ */

function iniciarTema() {
  /* O atributo já foi setado pelo script anti-flash. Aqui apenas
     sincronizamos o ícone e o aria-label do botão de alternância. */
  const tema = document.documentElement.getAttribute("data-tema") || "noturno";
  atualizarBotaoTema(tema);
}

function aplicarTema(tema, salvar = true) {
  const html = document.documentElement;
  /* .tema-transicao ativa as transições CSS somente durante a troca
     manual — não dispara na carga inicial da página. */
  html.classList.add("tema-transicao");
  html.setAttribute("data-tema", tema);
  if (salvar) localStorage.setItem("palcolivre-tema", tema);
  atualizarBotaoTema(tema);
  /* Atualiza a barra de endereços em dispositivos móveis. */
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = tema === "noturno" ? "#0b0812" : "#f7f5ff";
  setTimeout(() => html.classList.remove("tema-transicao"), 400);
}

function atualizarBotaoTema(tema) {
  const btn = $("#btn-tema");
  if (!btn) return;
  const noturno = tema === "noturno";
  /* No tema escuro: exibe o sol (clicar leva ao tema claro).
     No tema claro:  exibe a lua (clicar leva ao tema noturno). */
  btn.setAttribute("aria-label", noturno ? "Mudar para tema claro" : "Mudar para tema noturno");
  const use = btn.querySelector("use");
  if (use) use.setAttribute("href", noturno ? "#ic-sol" : "#ic-lua");
}

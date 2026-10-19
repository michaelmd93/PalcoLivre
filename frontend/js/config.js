/* ============================================================
   PALCOLIVRE — Configuração da marca
   ------------------------------------------------------------
   Nome, tagline e dados institucionais ficam aqui. Para
   rebatizar o produto, mude os valores abaixo (as cores estão
   em css/tokens.css).
   ============================================================ */

const SITE_CONFIG = {
  nome: "PalcoLivre",
  tagline: "O próximo show começa com a escolha certa.",
  descricao:
    "Marketplace que conecta músicos, bandas e cantores a contratantes do Vale do Paraíba.",
  emailContato: "contato@palcolivre.com.br",
  regiaoFoco: "Lorena e Guaratinguetá, SP",
  instituicao: "Projeto acadêmico — FATEC Guaratinguetá · Gestão da Tecnologia da Informação",

  /* Opções do filtro de cidade da busca principal.
     "regiao" indica que a opção abrange mais de uma cidade. */
  cidades: [
    { valor: "", rotulo: "Todas as cidades" },
    { valor: "Lorena", rotulo: "Lorena" },
    { valor: "Guaratinguetá", rotulo: "Guaratinguetá" },
    { valor: "Vale do Paraíba", rotulo: "Vale do Paraíba (região)", regiao: true },
  ],
};

/* ============================================================
   PALCOLIVRE — Dados demonstrativos
   ------------------------------------------------------------
   Estes artistas NÃO são usuários reais: são perfis ilustrativos
   usados apenas nesta etapa de front-end. Na etapa de back-end
   serão substituídos por registros do banco MySQL. Cada card
   exibe o selo "Demonstração" para deixar isso claro.

   Campo `foto`: URL pública do Unsplash (licença gratuita para
   demonstração). Se a imagem não carregar (ex.: sem internet),
   o card exibe o avatar de iniciais como fallback automático.
   ============================================================ */

const CATEGORIAS = [
  { nome: "MPB",        icone: "nota",      desc: "Voz, violão e poesia brasileira" },
  { nome: "Rock",       icone: "raio",      desc: "Bandas e artistas autorais" },
  { nome: "Sertanejo",  icone: "notas",     desc: "Duplas e moda de viola" },
  { nome: "Pop",        icone: "estrela",   desc: "Hits para animar o evento" },
  { nome: "Eletrônica", icone: "fone",      desc: "DJs e produtores" },
  { nome: "Jazz",       icone: "ondas",     desc: "Instrumental e bossa nova" },
  { nome: "Gospel",     icone: "coracao",   desc: "Louvor e música inspiradora" },
  { nome: "Clássica",   icone: "partitura", desc: "Erudito e cerimônias" },
];

const ARTISTAS_DEMO = [
  {
    id: 1,
    nome: "Marina Duarte",
    tipo: "Cantora e violonista",
    formato: "Solo",
    estilos: ["MPB", "Pop"],
    instrumentos: ["Voz", "Violão"],
    cidade: "Lorena",
    cache: "a combinar",
    cor: 262,
    /* Mulher com violão em palco iluminado — Marcela Laskoski / Unsplash */
    foto: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=640&h=280&q=75",
    fotoModal: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=320&h=320&q=75",
    bio: "Voz e violão com repertório de MPB e pop acústico para eventos intimistas, casamentos e casas de show.",
  },
  {
    id: 2,
    nome: "Os Vagalumes",
    tipo: "Banda",
    formato: "Banda (4 integrantes)",
    estilos: ["Rock", "Pop"],
    instrumentos: ["Guitarra", "Baixo", "Bateria", "Voz"],
    cidade: "Guaratinguetá",
    cache: "a combinar",
    cor: 285,
    /* Banda em performance ao vivo — Aditya Chinchure / Unsplash */
    foto: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=640&h=280&q=75",
    fotoModal: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=320&h=320&q=75",
    bio: "Banda de rock com repertório de clássicos nacionais e internacionais, além de composições autorais.",
  },
  {
    id: 3,
    nome: "Duo Serra Azul",
    tipo: "Dupla sertaneja",
    formato: "Dupla",
    estilos: ["Sertanejo"],
    instrumentos: ["Voz", "Violão", "Viola caipira"],
    cidade: "Lorena",
    cache: "a combinar",
    cor: 22,
    /* Guitarrista em performance acústica — Jefferson Santos / Unsplash */
    foto: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=640&h=280&q=75",
    fotoModal: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=320&h=320&q=75",
    bio: "Modas de viola e sertanejo universitário para festas, confraternizações e eventos ao ar livre.",
  },
  {
    id: 4,
    nome: "DJ Aluma",
    tipo: "DJ e produtora",
    formato: "Solo",
    estilos: ["Eletrônica"],
    instrumentos: ["DJ set", "Produção musical"],
    cidade: "Guaratinguetá",
    cache: "a combinar",
    cor: 190,
    /* DJ em console iluminado — Marcela Laskoski / Unsplash */
    foto: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?auto=format&fit=crop&w=640&h=280&q=75",
    fotoModal: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?auto=format&fit=crop&w=320&h=320&q=75",
    bio: "Sets de house, techno e brasilidades eletrônicas para festas, clubes e eventos corporativos.",
  },
  {
    id: 5,
    nome: "Varanda Jazz Trio",
    tipo: "Grupo instrumental",
    formato: "Trio",
    estilos: ["Jazz", "Instrumental"],
    instrumentos: ["Saxofone", "Contrabaixo", "Bateria"],
    cidade: "Guaratinguetá",
    cache: "a combinar",
    cor: 215,
    /* Músico de jazz em apresentação — Gio Bartlett / Unsplash */
    foto: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=640&h=280&q=75",
    fotoModal: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=320&h=320&q=75",
    bio: "Jazz e bossa para recepções, jantares e eventos que pedem uma trilha sonora elegante.",
  },
  {
    id: 6,
    nome: "Batera Souza",
    tipo: "Baterista freelancer",
    formato: "Solo",
    estilos: ["Rock", "Pop"],
    instrumentos: ["Bateria", "Percussão"],
    cidade: "Guaratinguetá",
    cache: "a combinar",
    cor: 330,
    /* Baterista em performance — Felicia Buitenwerf / Unsplash */
    foto: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=640&h=280&q=75",
    fotoModal: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=320&h=320&q=75",
    bio: "Baterista de apoio para bandas, estúdios e turnês regionais. Equipamento próprio.",
  },
  {
    id: 7,
    nome: "Lívia Reis",
    tipo: "Cantora",
    formato: "Solo",
    estilos: ["Gospel", "Pop"],
    instrumentos: ["Voz", "Teclado"],
    cidade: "Lorena",
    cache: "a combinar",
    cor: 300,
    /* Cantora no palco com microfone — Caught In Joy / Unsplash */
    foto: "https://images.unsplash.com/photo-1511735111819-9a3edb4907e6?auto=format&fit=crop&w=640&h=280&q=75",
    fotoModal: "https://images.unsplash.com/photo-1511735111819-9a3edb4907e6?auto=format&fit=crop&w=320&h=320&q=75",
    bio: "Louvores e pop inspirador para cerimônias, igrejas e eventos familiares.",
  },
];

const PASSOS = [
  {
    icone: "busca",
    titulo: "Busque",
    texto: "Encontre artistas por nome, estilo musical, instrumento ou cidade.",
  },
  {
    icone: "olho",
    titulo: "Conheça",
    texto: "Explore portfólios públicos com fotos, repertório e formato do show — sem precisar criar conta.",
  },
  {
    icone: "chat",
    titulo: "Contrate",
    texto: "Entre em contato direto com o artista e negocie data, duração e cachê. O contato pede um cadastro rápido.",
  },
];

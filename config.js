// =====================================================================
// Fibro Odontologia · dados editáveis do site
// Mudou telefone, horário, Instagram ou responsável técnico? Mude aqui.
// Os textos dos serviços e das perguntas estão escritos no index.html
// (assim o Google e as IAs leem sem precisar rodar JavaScript).
// =====================================================================
window.CONFIG = {
  versao: "fibro-prototipo-v5",
  prototipo: true, // true = mostra a faixa "Protótipo de proposta". Tirar na versão final.

  nome: "Fibro Odontologia",

  // WhatsApp só com números: 55 + DDD + número
  whatsapp: "5592984068131",
  mensagemWhatsapp: "Olá! Vim pelo site e gostaria de agendar uma avaliação.",
  // Mensagem quando a pessoa clica num serviço. {servico} vira o nome do serviço.
  mensagemServico: "Olá! Vim pelo site e gostaria de agendar uma avaliação de {servico}.",

  instagram: "fibroodontologia",

  mapsBusca: "Fibro Odontologia, Av. Prof. Nilton Lins, 1591, Flores, Manaus - AM",
  googleLink: "https://www.google.com/search?q=Fibro+Odontologia+Manaus",

  // Horário de atendimento. 0 = domingo ... 6 = sábado. null = fechado.
  horarios: {
    0: null,
    1: ["09:00", "18:00"],
    2: ["09:00", "18:00"],
    3: ["09:00", "18:00"],
    4: ["09:00", "18:00"],
    5: ["09:00", "18:00"],
    6: ["08:00", "12:00"]
  },
  fuso: "America/Manaus",

  // Responsável técnico (exigência do CFO). A CONFIRMAR com a clínica.
  responsavelTecnico: {
    nome: "", // ex.: "Dra. Fulana de Tal"
    cro: ""   // ex.: "CRO-AM 0000"
  },

  umamiId: "" // medição sem cookie. Vazio = desligado.
};

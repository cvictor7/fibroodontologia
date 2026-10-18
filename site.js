// Fibro Odontologia · comportamento do site (dados no config.js)
(function () {
  "use strict";
  var C = window.CONFIG || {};
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  // ---------- Medição sem cookie (Umami). Desligada se umamiId vazio ----------
  function evento(nome, dados) {
    try { if (window.umami && C.umamiId) window.umami.track(nome, dados); } catch (e) { /* sem medição */ }
  }
  if (C.umamiId) {
    var u = document.createElement("script");
    u.defer = true;
    u.src = "https://cloud.umami.is/script.js";
    u.setAttribute("data-website-id", C.umamiId);
    document.head.appendChild(u);
  }

  // ---------- Faixa de protótipo ----------
  if (C.prototipo === false && $("#faixa-prototipo")) $("#faixa-prototipo").hidden = true;

  // ---------- WhatsApp ----------
  function linkZap(texto) { return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(texto); }
  function prepararZap(a, texto, dados) {
    a.href = linkZap(texto);
    a.target = "_blank";
    a.rel = "noopener";
    a.addEventListener("click", function () { evento("whatsapp_click", dados); });
  }
  if (C.whatsapp) {
    $$(".js-zap").forEach(function (a) { prepararZap(a, C.mensagemWhatsapp, { local: a.dataset.local || "" }); });
    $$(".srv").forEach(function (li) {
      var nome = li.dataset.servico;
      var texto = (C.mensagemServico || C.mensagemWhatsapp).replace("{servico}", nome);
      $$(".js-zap-srv", li).forEach(function (a) { prepararZap(a, texto, { local: "servico", servico: nome }); });
    });
  }

  // ---------- Google, Instagram, Maps ----------
  if (C.googleLink) $$(".js-google").forEach(function (a) {
    a.href = C.googleLink;
    a.addEventListener("click", function () { evento("ver_avaliacoes"); });
  });
  if (C.instagram) $$(".js-instagram").forEach(function (a) {
    a.href = "https://www.instagram.com/" + C.instagram.replace("@", "") + "/";
    a.addEventListener("click", function () { evento("instagram_click"); });
  });
  if (C.mapsBusca) $$(".js-maps").forEach(function (a) {
    a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.mapsBusca);
    a.addEventListener("click", function () { evento("abrir_maps"); });
  });
  var mapaBtn = $("#mapa-btn");
  if (mapaBtn && C.mapsBusca) mapaBtn.addEventListener("click", function () {
    var f = document.createElement("iframe");
    f.src = "https://www.google.com/maps?q=" + encodeURIComponent(C.mapsBusca) + "&output=embed";
    f.title = "Mapa da Fibro Odontologia";
    f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade";
    var m = $("#mapa"); m.innerHTML = ""; m.appendChild(f);
  });

  // ---------- Responsável técnico ----------
  var rt = C.responsavelTecnico || {};
  if (rt.nome && rt.cro) $$(".js-rt").forEach(function (p) { p.textContent = rt.nome + ", " + rt.cro; });

  // ---------- Serviços: filtro + vitrine ----------
  var itens = $$(".srv");
  var painel = $("#srv-painel");
  var desktop = window.matchMedia("(min-width: 1000px)");

  function visiveis() { return itens.filter(function (li) { return !li.classList.contains("oculto"); }); }

  function mostrarNoPainel(li) {
    if (!li || !painel) return;
    itens.forEach(function (x) {
      x.classList.toggle("ativo", x === li);
      $(".srv-nome", x).setAttribute("aria-expanded", x === li ? "true" : "false");
    });
    var det = $(".srv-det", li).cloneNode(true);
    painel.innerHTML = "";
    var h = document.createElement("h3");
    h.textContent = $(".srv-nome", li).textContent.trim();
    painel.appendChild(h);
    while (det.firstChild) painel.appendChild(det.firstChild);
    var btn = $(".js-zap-srv", painel);
    if (btn && C.whatsapp) {
      var nome = li.dataset.servico;
      prepararZap(btn, (C.mensagemServico || C.mensagemWhatsapp).replace("{servico}", nome), { local: "servico", servico: nome });
    }
    painel.hidden = false;
    painel.classList.remove("troca"); void painel.offsetWidth; painel.classList.add("troca");
  }

  function alternarAcordeao(li) {
    var abrir = !li.classList.contains("aberto");
    itens.forEach(function (x) {
      var on = abrir && x === li;
      x.classList.toggle("aberto", on);
      $(".srv-nome", x).setAttribute("aria-expanded", on ? "true" : "false");
    });
    if (abrir) {
      evento("ver_servico", { servico: li.dataset.servico });
      var topo = li.getBoundingClientRect().top;
      if (topo < 70 || topo > window.innerHeight * 0.6) li.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  itens.forEach(function (li) {
    $(".srv-nome", li).addEventListener("click", function () {
      if (desktop.matches) { mostrarNoPainel(li); evento("ver_servico", { servico: li.dataset.servico }); }
      else alternarAcordeao(li);
    });
  });

  function modo() {
    itens.forEach(function (x) { x.classList.remove("aberto", "ativo"); $(".srv-nome", x).setAttribute("aria-expanded", "false"); });
    if (desktop.matches) mostrarNoPainel(visiveis()[0]);
    else if (painel) painel.hidden = true;
  }
  if (desktop.addEventListener) desktop.addEventListener("change", modo); else desktop.addListener(modo);

  $$(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.dataset.filtro;
      $$(".chip").forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      itens.forEach(function (li) {
        var cats = (li.dataset.cat || "").split(" ");
        li.classList.toggle("oculto", f !== "todos" && cats.indexOf(f) === -1);
      });
      var v = visiveis();
      if (desktop.matches) {
        var ativo = itens.filter(function (x) { return x.classList.contains("ativo") && !x.classList.contains("oculto"); })[0];
        mostrarNoPainel(ativo || v[0]);
      } else {
        itens.forEach(function (x) { x.classList.remove("aberto"); $(".srv-nome", x).setAttribute("aria-expanded", "false"); });
        if (f !== "todos" && v.length === 1) alternarAcordeao(v[0]);
      }
      evento("filtro_servico", { filtro: f });
    });
  });
  modo();

  // ---------- Aberto agora / fechado, no horário de Manaus ----------
  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  function agora() {
    var o = {};
    new Intl.DateTimeFormat("en-US", { timeZone: C.fuso || "America/Manaus", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false })
      .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    return { dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
  }
  function emMin(h) { var x = h.split(":"); return +x[0] * 60 + +x[1]; }
  function hora(h) { var x = h.split(":"); return +x[0] + "h" + (x[1] !== "00" ? x[1] : ""); }
  function proxima(dia, min) {
    for (var i = 0; i < 8; i++) {
      var d = (dia + i) % 7, h = C.horarios && C.horarios[d];
      if (!h || (i === 0 && min >= emMin(h[0]))) continue;
      return (i === 0 ? "hoje" : i === 1 ? "amanhã" : DIAS[d]) + " às " + hora(h[0]);
    }
    return "";
  }
  function status() {
    if (!C.horarios) return;
    var a = agora(), h = C.horarios[a.dia], aberto = h && a.min >= emMin(h[0]) && a.min < emMin(h[1]);
    var txt = aberto ? "Aberto agora, até " + hora(h[1]) : "Fechado agora. Abre " + proxima(a.dia, a.min) + ".";
    $$(".js-status").forEach(function (el) { el.textContent = txt; el.dataset.status = aberto ? "aberto" : "fechado"; });
    $$("#tabela-horarios tr").forEach(function (tr) { tr.classList.toggle("hoje", +tr.dataset.dia === a.dia); });
  }
  status();
  setInterval(status, 60000);

  // ---------- Topo e botão flutuante ----------
  var topo = $("#topo"), flut = $(".zap-flutuante"), inicio = $("#inicio"), chamada = $(".chamada");
  function rolar() {
    var y = window.scrollY || 0;
    if (topo) topo.classList.toggle("rolou", y > 8);
    if (!flut) return;
    var esconde = inicio ? inicio.getBoundingClientRect().bottom > 0 : y < 500;
    if (chamada) { var r = chamada.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) esconde = true; }
    flut.classList.toggle("escondido", esconde);
  }
  window.addEventListener("scroll", rolar, { passive: true });
  rolar();

  if ($("#ano")) $("#ano").textContent = new Date().getFullYear();
})();

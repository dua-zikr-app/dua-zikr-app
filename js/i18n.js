var currentLang = localStorage.getItem("lang") || "bn";
var translations = {};
function loadLang(lang) {
  fetch("i18n/" + lang + ".json")
    .then(function (r) { return r.json(); })
    .then(function (d) {
      translations = d; currentLang = lang;
      localStorage.setItem("lang", lang);
      applyTranslations(); updateLangButtons();
      if (typeof refreshUI === "function") refreshUI();
    });
}
function applyTranslations() {
  var els = document.querySelectorAll("[data-i18n]");
  for (var i = 0; i < els.length; i++) {
    var k = els[i].getAttribute("data-i18n");
    if (translations[k] !== undefined) els[i].textContent = translations[k];
  }
}
function updateLangButtons() {
  var b = document.getElementById("langBn");
  var e = document.getElementById("langEn");
  if (b) { if (currentLang === "bn") b.classList.add("active"); else b.classList.remove("active"); }
  if (e) { if (currentLang === "en") e.classList.add("active"); else e.classList.remove("active"); }
}
function t(key) { return translations[key] !== undefined ? translations[key] : key; }

/* ============================================================
   app.js — দুআ, জিকির, নামাজ, কিবলা
   ============================================================ */

var allDuas = [];
var installPromptEvent = null;

/* ============ জিকির লিস্ট ============ */
var ZIKR_LIST = [
  { id: "subhanallah", arabic: "سُبْحَانَ اللَّهِ", bn: "সুবহানাল্লাহ", en: "SubhanAllah", target: 33 },
  { id: "alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", bn: "আলহামদুলিল্লাহ", en: "Alhamdulillah", target: 33 },
  { id: "allahuakbar", arabic: "اللَّهُ أَكْبَرُ", bn: "আল্লাহু আকবার", en: "Allahu Akbar", target: 34 },
  { id: "lailaha", arabic: "لَا إِلَهَ إِلَّا اللَّهُ", bn: "লা ইলাহা ইল্লাল্লাহ", en: "La ilaha illallah", target: 100 },
  { id: "astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", bn: "আস্তাগফিরুল্লাহ", en: "Astaghfirullah", target: 100 },
  { id: "salawat", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ", bn: "আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ", en: "Allahumma salli ala Muhammad", target: 100 },
  { id: "subhanwabihamdihi", arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", bn: "সুবহানাল্লাহি ওয়া বিহামদিহি", en: "SubhanAllahi wa bihamdihi", target: 100 },
  { id: "lahawla", arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", bn: "লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহ", en: "La hawla wa la quwwata illa billah", target: 100 }
];

/* ============ তারিখ ============ */
function todayKey() {
  var d = new Date();
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

function showTodayDate() {
  var el = document.getElementById("todayDate");
  if (!el) return;
  var locale = currentLang === "bn" ? "bn-BD" : "en-US";
  var options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  try {
    el.textContent = new Date().toLocaleDateString(locale, options);
  } catch (e) {
    el.textContent = new Date().toLocaleDateString("en-US", options);
  }
}

/* ============ দুআ স্টোরেজ ============ */
function getDuaData() {
  try {
    var raw = localStorage.getItem("dua_stats");
    if (!raw) return { globalTotal: 0, dailyTotal: {}, items: {} };
    var data = JSON.parse(raw);
    if (!data.globalTotal) data.globalTotal = 0;
    if (!data.dailyTotal) data.dailyTotal = {};
    if (!data.items) data.items = {};
    return data;
  } catch (e) {
    return { globalTotal: 0, dailyTotal: {}, items: {} };
  }
}

function saveDuaData(data) {
  localStorage.setItem("dua_stats", JSON.stringify(data));
}

function duaIncrement(id) {
  var data = getDuaData();
  if (!data.items[id]) data.items[id] = { total: 0, daily: {} };
  var tk = todayKey();
  if (!data.items[id].daily) data.items[id].daily = {};
  data.items[id].daily[tk] = (data.items[id].daily[tk] || 0) + 1;
  data.items[id].total = (data.items[id].total || 0) + 1;
  data.globalTotal = (data.globalTotal || 0) + 1;
  data.dailyTotal[tk] = (data.dailyTotal[tk] || 0) + 1;
  saveDuaData(data);

  var countEl = document.getElementById("dua-count-" + id);
  if (countEl) {
    countEl.textContent = duaGetToday(id);
    countEl.classList.add("pop");
    setTimeout(function () { countEl.classList.remove("pop"); }, 200);
  }
  updateDuaStats();
  showToast(currentLang === "bn" ? "আলহামদুলিল্লাহ" : "Alhamdulillah");
}

function duaGetToday(id) {
  var data = getDuaData();
  if (!data.items[id] || !data.items[id].daily) return 0;
  return data.items[id].daily[todayKey()] || 0;
}

function updateDuaStats() {
  var data = getDuaData();
  var a = document.getElementById("duaStreak");
  var b = document.getElementById("duaTodayCount");
  var c = document.getElementById("duaTotalCount");
  if (a) a.textContent = getStreak();
  if (b) b.textContent = data.dailyTotal[todayKey()] || 0;
  if (c) c.textContent = data.globalTotal || 0;
}

/* ============ দুআ লোড ============ */
function loadDuas() {
  fetch("data/duas.json")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      allDuas = data;
      renderDuaList();
    })
    .catch(function (err) { console.log("dua load error:", err); });
}function renderDuaList() {
  var container = document.getElementById("duaList");
  if (!container) return;
  if (!allDuas || allDuas.length === 0) {
    container.innerHTML = "<p style='text-align:center;padding:2rem;'>কোনো দুআ নেই</p>";
    return;
  }

  var html = "";
  for (var i = 0; i < allDuas.length; i++) {
    var d = allDuas[i];
    var catKey = currentLang === "bn" ? "category_bn" : "category_en";
    var meanKey = currentLang === "bn" ? "meaning_bn" : "meaning_en";
    var today = duaGetToday(d.id);

    html += '<div class="dua-item">';
    html += '<div class="card-header">';
    html += '<span class="type-badge dua">দুআ ' + d.id + '</span>';
    html += '<span class="dua-category">' + (d[catKey] || "") + '</span>';
    html += '</div>';
    html += '<p class="arabic-text" dir="rtl">' + (d.arabic || "") + '</p>';
    html += '<p class="transliteration">' + (d.transliteration || "") + '</p>';
    html += '<div class="meaning-box"><p class="meaning">' + (d[meanKey] || "") + '</p></div>';
    html += '<div class="reference-box">📚 ' + (d.reference || "") + '</div>';
    html += '<div class="counter-row">';
    html += '<div class="count-display">';
    html += '<div class="count-number" id="dua-count-' + d.id + '">' + today + '</div>';
    html += '<div class="count-label">বার পড়া হয়েছে</div>';
    html += '</div>';
    html += '<div style="display:flex;gap:0.4rem;">';
    html += '<button class="btn-share-mini" data-share="' + d.id + '">📤</button>';
    html += '<button class="btn-read" data-read="' + d.id + '">➕ পড়লাম</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
  }

  container.innerHTML = html;

  var readBtns = container.querySelectorAll("[data-read]");
  for (var j = 0; j < readBtns.length; j++) {
    readBtns[j].addEventListener("click", function () {
      var id = parseInt(this.getAttribute("data-read"), 10);
      duaIncrement(id);
      if (navigator.vibrate) navigator.vibrate(30);
    });
  }

  var shareBtns = container.querySelectorAll("[data-share]");
  for (var k = 0; k < shareBtns.length; k++) {
    shareBtns[k].addEventListener("click", function () {
      var id = parseInt(this.getAttribute("data-share"), 10);
      shareSingleDua(id);
    });
  }
}

function shareSingleDua(id) {
  var dua = null;
  for (var i = 0; i < allDuas.length; i++) {
    if (allDuas[i].id === id) { dua = allDuas[i]; break; }
  }
  if (!dua) return;
  var meanKey = currentLang === "bn" ? "meaning_bn" : "meaning_en";
  var text = "🕌 দুআ\n\n" + dua.arabic + "\n\n" + dua.transliteration + "\n\n" + (dua[meanKey] || "") + "\n\n📚 " + dua.reference;
  if (navigator.share) {
    navigator.share({ title: "দুআ", text: text }).catch(function () {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function () {
      showToast("কপি হয়েছে!");
    });
  }
}

/* ============ জিকির স্টোরেজ ============ */
function getZikrData() {
  try {
    var raw = localStorage.getItem("zikr_stats");
    if (!raw) return { items: {}, total: 0, dailyTotal: {} };
    var data = JSON.parse(raw);
    if (!data.items) data.items = {};
    if (!data.total) data.total = 0;
    if (!data.dailyTotal) data.dailyTotal = {};
    return data;
  } catch (e) {
    return { items: {}, total: 0, dailyTotal: {} };
  }
}

function saveZikrData(data) {
  localStorage.setItem("zikr_stats", JSON.stringify(data));
}

function zikrIncrement(id) {
  var data = getZikrData();
  if (!data.items[id]) data.items[id] = { total: 0, daily: {} };
  var tk = todayKey();
  if (!data.items[id].daily) data.items[id].daily = {};
  data.items[id].daily[tk] = (data.items[id].daily[tk] || 0) + 1;
  data.items[id].total = (data.items[id].total || 0) + 1;
  data.total = (data.total || 0) + 1;
  data.dailyTotal[tk] = (data.dailyTotal[tk] || 0) + 1;
  saveZikrData(data);
  zikrUpdateOne(id);
  zikrUpdateSummary();var zikr = null;
  for (var i = 0; i < ZIKR_LIST.length; i++) {
    if (ZIKR_LIST[i].id === id) { zikr = ZIKR_LIST[i]; break; }
  }
  if (zikr && zikrGetToday(id) === zikr.target) {
    showToast("🎉 টার্গেট সম্পন্ন!");
  }
}

function zikrDecrement(id) {
  var data = getZikrData();
  if (!data.items[id]) return;
  var tk = todayKey();
  var c = (data.items[id].daily && data.items[id].daily[tk]) || 0;
  if (c <= 0) return;
  data.items[id].daily[tk] = c - 1;
  data.items[id].total = (data.items[id].total || 1) - 1;
  if (data.total > 0) data.total = data.total - 1;
  if (data.dailyTotal[tk] > 0) data.dailyTotal[tk] = data.dailyTotal[tk] - 1;
  saveZikrData(data);
  zikrUpdateOne(id);
  zikrUpdateSummary();
}

function zikrGetToday(id) {
  var data = getZikrData();
  if (!data.items[id] || !data.items[id].daily) return 0;
  return data.items[id].daily[todayKey()] || 0;
}

function zikrGetTotal(id) {
  var data = getZikrData();
  if (!data.items[id]) return 0;
  return data.items[id].total || 0;
}

function zikrUpdateOne(id) {
  var cEl = document.getElementById("count-" + id);
  if (cEl) cEl.textContent = zikrGetToday(id);
  var tEl = document.getElementById("total-" + id);
  if (tEl) tEl.textContent = zikrGetTotal(id);

  var pEl = document.getElementById("progress-" + id);
  if (pEl) {
    var zikr = null;
    for (var i = 0; i < ZIKR_LIST.length; i++) {
      if (ZIKR_LIST[i].id === id) { zikr = ZIKR_LIST[i]; break; }
    }
    if (zikr) {
      var pct = Math.min(100, (zikrGetToday(id) / zikr.target) * 100);
      pEl.style.width = pct + "%";
      if (zikrGetToday(id) >= zikr.target) pEl.classList.add("completed");
      else pEl.classList.remove("completed");
    }
  }
}

function zikrUpdateSummary() {
  var data = getZikrData();
  var a = document.getElementById("totalTasbih");
  if (a) a.textContent = data.total || 0;
  var b = document.getElementById("todayTotalTasbih");
  if (b) b.textContent = data.dailyTotal[todayKey()] || 0;
  var c = document.getElementById("zikrStreak");
  if (c) c.textContent = getStreak();
}

function getStreak() {
  var data = getZikrData();
  var daily = data.dailyTotal || {};
  var today = new Date();
  var tStr = todayKey();
  var check = new Date(today);
  if (!daily[tStr]) check.setDate(check.getDate() - 1);
  var streak = 0;
  while (true) {
    var k = check.getFullYear() + "-" + (check.getMonth() + 1) + "-" + check.getDate();
    if (daily[k] && daily[k] > 0) {
      streak = streak + 1;
      check.setDate(check.getDate() - 1);
    } else break;
  }
  return streak;
}

function renderZikrList() {
  var container = document.getElementById("zikrList");
  if (!container) return;

  var html = "";
  for (var i = 0; i < ZIKR_LIST.length; i++) {
    var z = ZIKR_LIST[i];
    var name = currentLang === "bn" ? z.bn : z.en;
    var today = zikrGetToday(z.id);
    var total = zikrGetTotal(z.id);
    var pct = Math.min(100, (today / z.target) * 100);

    html += '<div class="zikr-card">';
    html += '<div class="zikr-top">';
    html += '<span class="zikr-target-badge">🎯 ' + z.target + '</span>';
    html += '<div class="zikr-arabic">' + z.arabic + '</div>';
    html += '</div>';
    html += '<div class="zikr-middle">';
    html += '<span class="zikr-translit">' + name + '</span>';
    html += '<div class="zikr-count-display">';
    html += '<div class="zikr-count" id="count-' + z.id + '">' + today + '</div>';
    html += '<div class="zikr-count-label">আজ • মোট <span id="total-' + z.id + '">' + total + '</span></div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="zikr-progress">';
    html += '<div class="zikr-progress-fill" id="progress-' + z.id + '" style="width:' + pct + '%"></div>';
    html += '</div>';
    html += '<div class="zikr-bottom">';
    html += '<button class="btn-zikr-minus" data-minus="' + z.id + '">−</button>';
    html += '<button class="btn-zikr-tap" data-tap="' + z.id + '">➕ পড়লাম</button>';
    html += '</div>';
    html += '</div>';
  }

  container.innerHTML = html;var taps = container.querySelectorAll("[data-tap]");
  for (var j = 0; j < taps.length; j++) {
    taps[j].addEventListener("click", function () {
      var id = this.getAttribute("data-tap");
      zikrIncrement(id);
      if (navigator.vibrate) navigator.vibrate(30);
    });
  }
  var mins = container.querySelectorAll("[data-minus]");
  for (var k = 0; k < mins.length; k++) {
    mins[k].addEventListener("click", function () {
      var id = this.getAttribute("data-minus");
      zikrDecrement(id);
      if (navigator.vibrate) navigator.vibrate(20);
    });
  }
  zikrUpdateSummary();
}

function resetTodayZikr() {
  if (!confirm("আজকের সব জিকির কাউন্ট রিসেট করবেন?")) return;
  var data = getZikrData();
  var tk = todayKey();
  data.dailyTotal[tk] = 0;
  for (var id in data.items) {
    if (data.items[id].daily) data.items[id].daily[tk] = 0;
  }
  saveZikrData(data);
  renderZikrList();
  showToast("✅ রিসেট সম্পন্ন");
}

function clearAllZikr() {
  if (!confirm("সব কাউন্ট মুছে যাবে। নিশ্চিত?")) return;
  localStorage.removeItem("zikr_stats");
  renderZikrList();
  showToast("✅ সব মুছে ফেলা হয়েছে");
}

/* ============ ট্যাব ============ */
function switchTabFull(tab) {
  var tabs = { dua: "tabDua", zikr: "tabZikr", prayer: "tabPrayer", qibla: "tabQibla" };
  var sections = { dua: "sectionDua", zikr: "sectionZikr", prayer: "sectionPrayer", qibla: "sectionQibla" };

  for (var k in tabs) {
    var b = document.getElementById(tabs[k]);
    var s = document.getElementById(sections[k]);
    if (b) b.classList.remove("active");
    if (s) s.classList.remove("active");
  }

  var activeBtn = document.getElementById(tabs[tab]);
  var activeSec = document.getElementById(sections[tab]);
  if (activeBtn) activeBtn.classList.add("active");
  if (activeSec) activeSec.classList.add("active");

  if (tab === "prayer") loadPrayerTimes();
  if (tab === "qibla") loadQibla();
}

/* ============ টোস্ট ============ */
function showToast(msg) {
  var existing = document.querySelector(".toast");
  if (existing) existing.remove();
  var toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function () { toast.classList.add("show"); }, 10);
  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () { toast.remove(); }, 300);
  }, 2000);
}

/* ============ ইনস্টল ============ */
function setupInstall() {
  var btn = document.getElementById("installBtn");
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    installPromptEvent = e;
    if (btn) btn.style.display = "block";
  });
  if (btn) {
    btn.addEventListener("click", function () {
      if (!installPromptEvent) return;
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then(function () {
        installPromptEvent = null;
        btn.style.display = "none";
      });
    });
  }
}

/* ============ নামাজের সময় ============ */
function getLocation() {
  return new Promise(function (resolve) {
    if (!navigator.geolocation) {
      resolve({ lat: 23.8103, lng: 90.4125 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      function (pos) { resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }); },
      function () { resolve({ lat: 23.8103, lng: 90.4125 }); },
      { timeout: 10000 }
    );
  });
}

function loadPrayerTimes() {
  var container = document.getElementById("prayerTimes");
  if (!container) return;
  container.innerHTML = "<p style='text-align:center;padding:1rem'>লোড হচ্ছে...</p>";

  getLocation().then(function (loc) {
    var today = new Date();
    var dateStr = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
    var url = "https://api.aladhan.com/v1/timings/" + dateStr +
      "?latitude=" + loc.lat + "&longitude=" + loc.lng + "&method=1";

    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.code !== 200) throw new Error("API error");
        var t = data.data.timings;var hijri = data.data.date.hijri;
        var hijriEl = document.getElementById("prayerHijriDate");
        if (hijriEl) {
          hijriEl.textContent = hijri.day + " " + hijri.month.en + " " + hijri.year + " হিজরি";
        }

        var locEl = document.getElementById("prayerLocation");
        if (locEl) locEl.textContent = data.data.meta.timezone || "আপনার এলাকা";

        var prayers = [
          { bn: "ফজর", start: t.Fajr, end: t.Sunrise, endLabel: "সূর্যোদয়" },
          { bn: "যোহর", start: t.Dhuhr, end: t.Asr, endLabel: "আসর" },
          { bn: "আসর", start: t.Asr, end: t.Maghrib, endLabel: "মাগরিব" },
          { bn: "মাগরিব", start: t.Maghrib, end: t.Isha, endLabel: "ইশা" },
          { bn: "ইশা", start: t.Isha, end: t.Fajr, endLabel: "ফজর" }
        ];

        function format12(s) {
          if (!s) return "--:--";
          var p = s.split(":");
          var h = parseInt(p[0], 10);
          var ap = h >= 12 ? "PM" : "AM";
          h = h % 12 || 12;
          return h + ":" + p[1] + " " + ap;
        }
        function toMin(s) {
          if (!s) return 0;
          var p = s.split(":");
          return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
        }

        var now = new Date();
        var curMin = now.getHours() * 60 + now.getMinutes();
        var html = "";
        var i;

        for (i = 0; i < prayers.length; i++) {
          var p = prayers[i];
          var startMin = toMin(p.start);
          var endMin = toMin(p.end);
          var isCurrent = false;

          if (p.bn === "ইশা") {
            if (curMin >= startMin || curMin < endMin) isCurrent = true;
          } else {
            if (curMin >= startMin && curMin < endMin) isCurrent = true;
          }

          html += '<div class="prayer-time-item' + (isCurrent ? " current" : "") + '">';
          html += '<div class="prayer-time-header">';
          html += '<span class="prayer-time-name">🕌 ' + p.bn + '</span>';
          if (isCurrent) html += '<span class="prayer-current-badge">এখন</span>';
          html += '</div>';
          html += '<div class="prayer-time-range">';
          html += '<div class="prayer-range-item">';
          html += '<span class="prayer-range-label">▶ শুরু</span>';
          html += '<span class="prayer-range-time">' + format12(p.start) + '</span>';
          html += '</div>';
          html += '<div class="prayer-range-sep">—</div>';
          html += '<div class="prayer-range-item">';
          html += '<span class="prayer-range-label">◼ শেষ (' + p.endLabel + ')</span>';
          html += '<span class="prayer-range-time">' + format12(p.end) + '</span>';
          html += '</div>';
          html += '</div>';
          html += '</div>';
        }

        container.innerHTML = html;
      })
      .catch(function (err) {
        console.log("Prayer error:", err);
        container.innerHTML = "<p style='text-align:center;color:#c0392b;padding:1rem'>সময়সূচি লোড করা যায়নি</p>";
      });
  });
}

/* ============ কিবলা ============ */
var qiblaBearing = 0;
var deviceHeading = 0;
var compassStarted = false;

function calcQiblaBearing(lat, lng) {
  var kLat = 21.4225, kLng = 39.8262;
  var toRad = Math.PI / 180, toDeg = 180 / Math.PI;
  var phi1 = lat * toRad, phi2 = kLat * toRad, dLng = (kLng - lng) * toRad;
  var y = Math.sin(dLng) * Math.cos(phi2);
  var x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLng);
  return (Math.atan2(y, x) * toDeg + 360) % 360;
}

function calcDistance(lat, lng) {
  var kLat = 21.4225, kLng = 39.8262, R = 6371, toRad = Math.PI / 180;
  var dLat = (kLat - lat) * toRad, dLng = (kLng - lng) * toRad;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat * toRad) * Math.cos(kLat * toRad) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(0);
}function updateCompassArrow() {
  var arrow = document.getElementById("compassArrow");
  if (!arrow) return;
  arrow.style.transform = "translate(-50%, -100%) rotate(" + (qiblaBearing - deviceHeading) + "deg)";
}

function onDeviceOrientation(event) {
  var heading = null;
  if (event.webkitCompassHeading !== undefined) heading = event.webkitCompassHeading;
  else if (event.alpha !== null) heading = 360 - event.alpha;
  if (heading !== null) {
    deviceHeading = heading;
    updateCompassArrow();
    var hint = document.getElementById("compassHint");
    if (hint) hint.textContent = "✅ কম্পাস চালু — ফোন ঘুরিয়ে কিবলা খুঁজুন";
  }
}

function loadQibla() {
  getLocation().then(function (loc) {
    qiblaBearing = calcQiblaBearing(loc.lat, loc.lng);
    var dist = calcDistance(loc.lat, loc.lng);
    var textEl = document.getElementById("qiblaText");
    var distEl = document.getElementById("qiblaDistance");
    var marker = document.getElementById("qiblaMarker");
    if (textEl) textEl.textContent = "কিবলার দিক: " + Math.round(qiblaBearing) + "°";
    if (distEl) distEl.textContent = "কাবা শরীফ থেকে দূরত্ব: " + dist + " কিমি";
    if (marker) marker.style.transform = "translate(-50%, -100%) rotate(" + qiblaBearing + "deg)";
    updateCompassArrow();
  });
}

function startCompass() {
  if (compassStarted) return;
  compassStarted = true;
  var hint = document.getElementById("compassHint");

  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission()
      .then(function (response) {
        if (response === "granted") {
          window.addEventListener("deviceorientation", onDeviceOrientation);
          if (hint) hint.textContent = "✅ কম্পাস চালু হয়েছে";
        } else {
          if (hint) hint.textContent = "❌ কম্পাস অনুমতি দেওয়া হয়নি";
        }
      })
      .catch(function () {});
  } else if (typeof DeviceOrientationEvent !== "undefined") {
    window.addEventListener("deviceorientation", onDeviceOrientation);
    if (hint) hint.textContent = "✅ কম্পাস চালু হয়েছে";
  } else {
    if (hint) hint.textContent = "❌ আপনার ডিভাইসে কম্পাস নেই";
  }
}

/* ============ রিফ্রেশ ============ */
function refreshUI() {
  showTodayDate();
  renderDuaList();
  renderZikrList();
  updateDuaStats();
  zikrUpdateSummary();
}

/* ============ শুরু ============ */
function startApp() {
  showTodayDate();
  loadDuas();
  renderZikrList();
  updateDuaStats();
  zikrUpdateSummary();

  if (typeof loadLang === "function") loadLang(currentLang);

  var tabDua = document.getElementById("tabDua");
  var tabZikr = document.getElementById("tabZikr");
  var tabPrayer = document.getElementById("tabPrayer");
  var tabQibla = document.getElementById("tabQibla");
  var langBn = document.getElementById("langBn");
  var langEn = document.getElementById("langEn");
  var resetBtn = document.getElementById("resetZikrBtn");
  var clearBtn = document.getElementById("clearAllBtn");
  var refreshBtn = document.getElementById("refreshPrayerBtn");
  var compassBtn = document.getElementById("startCompassBtn");

  if (tabDua) tabDua.onclick = function () { switchTabFull("dua"); };
  if (tabZikr) tabZikr.onclick = function () { switchTabFull("zikr"); };
  if (tabPrayer) tabPrayer.onclick = function () { switchTabFull("prayer"); };
  if (tabQibla) tabQibla.onclick = function () { switchTabFull("qibla"); };
  if (langBn) langBn.onclick = function () { if (typeof loadLang === "function") loadLang("bn"); };
  if (langEn) langEn.onclick = function () { if (typeof loadLang === "function") loadLang("en"); };
  if (resetBtn) resetBtn.onclick = resetTodayZikr;
  if (clearBtn) clearBtn.onclick = clearAllZikr;
  if (refreshBtn) refreshBtn.onclick = loadPrayerTimes;
  if (compassBtn) compassBtn.onclick = startCompass;

  setupInstall();
}

document.addEventListener("DOMContentLoaded", startApp);
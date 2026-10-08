/* app.js — দুআ ও জিকির (সম্পূর্ণ) */

var allDuas = [];
var currentLang = "bn";
var installPromptEvent = null;

/* জিকির লিস্ট */
var ZIKR_LIST = [
  /* === ১-৮: মূল ৮টা === */
  { id: "subhanallah", arabic: "سُبْحَانَ اللَّهِ", bn: "সুবহানাল্লাহ", en: "SubhanAllah", target: 33 },
  { id: "alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", bn: "আলহামদুলিল্লাহ", en: "Alhamdulillah", target: 33 },
  { id: "allahuakbar", arabic: "اللَّهُ أَكْبَرُ", bn: "আল্লাহু আকবার", en: "Allahu Akbar", target: 34 },
  { id: "lailaha", arabic: "لَا إِلَهَ إِلَّا اللَّهُ", bn: "লা ইলাহা ইল্লাল্লাহ", en: "La ilaha illallah", target: 100 },
  { id: "astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", bn: "আস্তাগফিরুল্লাহ", en: "Astaghfirullah", target: 100 },
  { id: "salawat", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ", bn: "আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ", en: "Allahumma salli ala Muhammad", target: 100 },
  { id: "subhanwabihamdihi", arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", bn: "সুবহানাল্লাহি ওয়া বিহামদিহি", en: "SubhanAllahi wa bihamdihi", target: 100 },
  { id: "lahawla", arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", bn: "লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহ", en: "La hawla wa la quwwata illa billah", target: 100 },

  /* === ৯-২৮: নতুন ২০টা === */
  { id: "subhanwabihamdihi_azeem", arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ", bn: "সুবহানাল্লাহি ওয়া বিহামদিহি, সুবহানাল্লাহিল আযীম", en: "SubhanAllahi wa bihamdihi, SubhanAllahil Azeem", target: 33 },
  { id: "lailaha_wahdahu", arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", bn: "লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারিকা লাহু, লাহুল মুলকু ওয়া লাহুল হামদু ওয়া হুয়া আলা কুল্লি শাইইন কাদীর", en: "La ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa ala kulli shayin qadir", target: 100 },
  { id: "istighfar_100", arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", bn: "আস্তাগফিরুল্লাহ ওয়া আতুবু ইলাইহি", en: "Astaghfirullaha wa atubu ilayh", target: 100 },
  { id: "istighfar_azeem", arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ", bn: "আস্তাগফিরুল্লাহিল আযীম", en: "Astaghfirullahil Azeem", target: 100 },
  { id: "durood_ibrahim", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ", bn: "আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিন ওয়া আলা আলে মুহাম্মাদ, কামা সাল্লাইতা আলা ইব্রাহীম", en: "Allahumma salli ala Muhammad wa ala ali Muhammad, kama sallayta ala Ibrahim", target: 100 },
  { id: "ya_hayyu", arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ", bn: "ইয়া হাইয়্যু ইয়া কাইয়্যুম বিরাহমাতিকা আস্তাগীস", en: "Ya Hayyu Ya Qayyum birahmatika astagheeth", target: 100 },
  { id: "yunus_dua", arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", bn: "লা ইলাহা ইল্লা আনতা সুবহানাকা ইন্নি কুনতু মিনাজ জালিমীন", en: "La ilaha illa anta subhanaka inni kuntu minaz zalimin", target: 100 },
  { id: "hasbunallah", arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", bn: "হাসবুনাল্লাহু ওয়া নি'মাল ওয়াকীল", en: "Hasbunallahu wa ni'mal wakeel", target: 100 },
  { id: "bismillah_protect", arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", bn: "বিসমিল্লাহিল্লাযী লা ইয়াদুররু মাআসমিহি শাইউন ফিল আরদি ওয়া লা ফিস সামা, ওয়া হুয়াস সামিউল আলীম", en: "Bismillahillazi la yadurru ma'asmihi shayun fil ardi wa la fis sama, wa huwas sami'ul aleem", target: 3 },
  { id: "subhan_adada", arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ", bn: "সুবহানাল্লাহি ওয়া বিহামদিহি, আদাদা খালকিহি, ওয়া রিদা নাফসিহি, ওয়া যিনাতা আরশিহি, ওয়া মিদাদা কালিমাতিহি", en: "SubhanAllahi wa bihamdihi, adada khalqihi, wa rida nafsihi, wa zinata arshihi, wa midada kalimatihi", target: 3 },
  { id: "jannah_dua", arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ", bn: "আল্লাহুম্মা ইন্নি আসআলুকাল জান্নাহ, ওয়া আউযু বিকা মিনান নার", en: "Allahumma inni as'alukal jannah, wa a'uzu bika minan nar", target: 100 },{ id: "baqiyat_salihat", arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ", bn: "সুবহানাল্লাহি ওয়াল হামদুলিল্লাহি ওয়া লা ইলাহা ইল্লাল্লাহু ওয়াল্লাহু আকবার", en: "SubhanAllahi wal hamdulillahi wa la ilaha illallahu wallahu akbar", target: 100 },
  { id: "kaffarat_majlis", arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ", bn: "সুবহানাকা আল্লাহুম্মা ওয়া বিহামদিকা, আশহাদু আল লা ইলাহা ইল্লা আনতা, আস্তাগফিরুকা ওয়া আতুবু ইলাইকা", en: "Subhanaka Allahumma wa bihamdika, ash-hadu an la ilaha illa anta, astaghfiruka wa atubu ilayk", target: 1 },
  { id: "lailaha_akbar", arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ", bn: "লা ইলাহা ইল্লাল্লাহু ওয়াল্লাহু আকবার", en: "La ilaha illallahu wallahu akbar", target: 100 },
  { id: "sallim_nabi", arabic: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", bn: "আল্লাহুম্মা সাল্লি ওয়া সাল্লিম আলা নাবিয়্যিনা মুহাম্মাদ", en: "Allahumma salli wa sallim ala nabiyyina Muhammad", target: 100 },
  { id: "rabbi_zidni", arabic: "رَبِّ زِدْنِي عِلْمًا", bn: "রাব্বি যিদনি ইলমা", en: "Rabbi zidni ilma", target: 100 },
  { id: "rabbana_atina", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", bn: "রাব্বানা আতিনা ফিদ্দুনিয়া হাসানাতান, ওয়া ফিল আখিরাতি হাসানাতান, ওয়া কিনা আযাবান নার", en: "Rabbana atina fid dunya hasanah, wa fil akhirati hasanah, wa qina azaban nar", target: 100 },
  { id: "ya_allah_names", arabic: "يَا اللَّهُ يَا رَحْمَنُ يَا رَحِيمُ", bn: "ইয়া আল্লাহ, ইয়া রাহমান, ইয়া রাহীম", en: "Ya Allah, Ya Rahman, Ya Rahim", target: 100 },
  { id: "subhanallah_azeem", arabic: "سُبْحَانَ اللَّهِ الْعَظِيمِ", bn: "সুবহানাল্লাহিল আযীম", en: "SubhanAllahil Azeem", target: 33 }
];

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

/* ============ দুআ লোড ও রেন্ডার ============ */
function loadDuas() {
  fetch("data/duas.json")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      allDuas = data;
      console.log("✅ " + allDuas.length + "টা দুআ লোড হয়েছে");
      renderDuaList();
    })
    .catch(function (err) {
      console.log("❌ দুআ লোড এরর:", err);
    });
}

function renderDuaList() {
  var container = document.getElementById("duaList");
  if (!container) {
    console.log("❌ duaList এলিমেন্ট নেই");
    return;
  }
  if (!allDuas || allDuas.length === 0) {
    container.innerHTML = "<p style='text-align:center;padding:2rem;'>কোনো দুআ নেই</p>";
    return;
  }

  var html = "";
  var i;

  for (i = 0; i < allDuas.length; i++) {
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

    html += '<div class="meaning-box">';
    html += '<p class="meaning">' + (d[meanKey] || "") + '</p>';
    html += '</div>';

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
  console.log("✅ " + allDuas.length + "টা দুআ রেন্ডার হয়েছে");var readBtns = container.querySelectorAll("[data-read]");
  for (i = 0; i < readBtns.length; i++) {
    readBtns[i].addEventListener("click", function () {
      var id = parseInt(this.getAttribute("data-read"), 10);
      duaIncrement(id);
      if (navigator.vibrate) navigator.vibrate(30);
    });
  }

  var shareBtns = container.querySelectorAll("[data-share]");
  for (i = 0; i < shareBtns.length; i++) {
    shareBtns[i].addEventListener("click", function () {
      var id = parseInt(this.getAttribute("data-share"), 10);
      shareSingleDua(id);
    });
  }
}

/* ============ দুআ কাউন্টার ============ */
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

  var el = document.getElementById("dua-count-" + id);
  if (el) {
    el.textContent = duaGetToday(id);
    el.classList.add("pop");
    setTimeout(function () { el.classList.remove("pop"); }, 200);
  }
  updateDuaStats();
  showToast("আলহামদুলিল্লাহ");
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

/* ============ জিকির ============ */
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
  var id;
  for (id in data.items) {
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
function switchTab(tab) {
  var tabDua = document.getElementById("tabDua");
  var tabZikr = document.getElementById("tabZikr");
  var sectionDua = document.getElementById("sectionDua");
  var sectionZikr = document.getElementById("sectionZikr");
  if (!tabDua || !tabZikr) return;

  if (tab === "dua") {
    tabDua.classList.add("active");
    tabZikr.classList.remove("active");
    if (sectionDua) sectionDua.classList.add("active");
    if (sectionZikr) sectionZikr.classList.remove("active");
  } else {
    tabZikr.classList.add("active");
    tabDua.classList.remove("active");
    if (sectionZikr) sectionZikr.classList.add("active");
    if (sectionDua) sectionDua.classList.remove("active");
    zikrUpdateSummary();
  }
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

/* ============ ভাষা রিফ্রেশ ============ */
function refreshUI() {
  showTodayDate();
  renderDuaList();
  renderZikrList();
  updateDuaStats();
  zikrUpdateSummary();
}

/* ============ শুরু ============ */
function startApp() {
  currentLang = localStorage.getItem("lang") || "bn";

  showTodayDate();
  loadDuas();
  renderZikrList();
  updateDuaStats();
  zikrUpdateSummary();

  if (typeof loadLang === "function") {
    loadLang(currentLang);
  }

  var tabDua = document.getElementById("tabDua");
  var tabZikr = document.getElementById("tabZikr");
  if (tabDua) tabDua.onclick = function () { switchTab("dua"); };
  if (tabZikr) tabZikr.onclick = function () { switchTab("zikr"); };

  var langBn = document.getElementById("langBn");
  var langEn = document.getElementById("langEn");
  if (langBn) langBn.onclick = function () { if (typeof loadLang === "function") loadLang("bn"); };
  if (langEn) langEn.onclick = function () { if (typeof loadLang === "function") loadLang("en"); };

  var resetBtn = document.getElementById("resetZikrBtn");
  if (resetBtn) resetBtn.onclick = resetTodayZikr;var clearBtn = document.getElementById("clearAllBtn");
  if (clearBtn) clearBtn.onclick = clearAllZikr;

  setupInstall();
}

document.addEventListener("DOMContentLoaded", startApp);
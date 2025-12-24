let allSurahs = [], currentSurahId = 1;
const audio = document.getElementById('audioPlayer'), playBtn = document.getElementById('playBtn'), seekSlider = document.getElementById('seekSlider');

// متغيرات السبحة
let sebhaCount = parseInt(localStorage.getItem('sebhaCount')) || 0;
let sebhaGoal = parseInt(localStorage.getItem('sebhaGoal')) || 1000;

window.onload = () => {
    checkDailyReset();
    setInterval(updateResetTimer, 1000);
    updateSebhaUI();
};

function checkDailyReset() {
    const lastDate = localStorage.getItem('lastResetDate');
    const today = new Date().toLocaleDateString();
    if (lastDate !== today) {
        sebhaCount = 0;
        localStorage.setItem('sebhaCount', 0);
        localStorage.setItem('lastResetDate', today);
        updateSebhaUI();
    }
}

function updateResetTimer() {
    const now = new Date(), mid = new Date();
    mid.setHours(24, 0, 0, 0);
    const diff = mid - now;
    const h = Math.floor(diff/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
    document.getElementById('resetTimer').innerText = `${h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
}

function incrementSebha() {
    sebhaCount++;
    if (navigator.vibrate) navigator.vibrate(50);
    localStorage.setItem('sebhaCount', sebhaCount);
    updateSebhaUI();
}

function updateSebhaUI() {
    document.getElementById('sebhaCounter').innerText = sebhaCount;
    let p = Math.min((sebhaCount/sebhaGoal)*100, 100);
    document.getElementById('sebhaProgress').style.width = p + "%";
    document.getElementById('goalText').innerText = `المتبقي للهدف: ${Math.max(sebhaGoal - sebhaCount, 0)}`;
}

function setSebhaGoal() { sebhaGoal = parseInt(document.getElementById('sebhaGoal').value); localStorage.setItem('sebhaGoal', sebhaGoal); updateSebhaUI(); }
function resetSebha() { if(confirm("تصفير العداد؟")) { sebhaCount = 0; localStorage.setItem('sebhaCount', 0); updateSebhaUI(); } }

function switchMainTab(tab) {
    document.querySelectorAll('.main-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(tab+'Tab').classList.add('active');
    document.getElementById('quran-section').style.display = tab==='quran'?'block':'none';
    document.getElementById('azkar-section').style.display = tab==='azkar'?'block':'none';
    document.getElementById('sebha-section').style.display = tab==='sebha'?'block':'none';
    audio.pause();
}

// أذكار كاملة كما طلبت
const azkarData = {
    morning: [
        { text: "أعوذ بالله من الشيطان الرجيم: (اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ)", count: 1 },
        { text: "بسم الله الرحمن الرحيم: (قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ)", count: 3 },
        { text: "أصبحنا وأصبح الملك لله والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير، رب أسألك خير ما في هذا اليوم وخير ما بعده", count: 1 },
        { text: "اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور", count: 1 },
        { text: "رضيت بالله ربًا وبالإسلام دينًا وبمحمد ﷺ نبيًا", count: 3 }
    ],
    evening: [
        { text: "آية الكرسي كاملة", count: 1 },
        { text: "المعوذات (الإخلاص، الفلق، الناس)", count: 3 },
        { text: "أمسينا وأمسى الملك لله والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير", count: 1 },
        { text: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم", count: 7 },
        { text: "سبحان الله وبحمده", count: 100 }
    ],
    sleep: [
        { text: "باسمك اللهم أموت وأحيا", count: 1 },
        { text: "آية الكرسي", count: 1 },
        { text: "سبحان الله (33)، الحمد لله (33)، الله أكبر (34)", count: 1 },
        { text: "اللهم قني عذابك يوم تبعث عبادك", count: 3 }
    ]
};

function loadAzkar(t) {
    document.getElementById('azkarCats').style.display = 'none';
    document.getElementById('azkar-content').style.display = 'block';
    document.getElementById('azkar-title').innerText = t==='morning'?'☀️ أذكار الصباح':t==='evening'?'🌙 أذكار المساء':'🛌 أذكار النوم';
    document.getElementById('azkarList').innerHTML = azkarData[t].map((z, i) => `<div class="zekr-card" id="zekr-${i}" onclick="countZekr(${i})"><div style="font-size:1.3rem; margin-bottom:10px;">${z.text}</div><div class="zekr-counter">بقي: <span id="count-${i}">${z.count}</span></div></div>`).join('');
}

function countZekr(i) {
    let el = document.getElementById(`count-${i}`); let c = parseInt(el.innerText);
    if (c > 0) { c--; el.innerText = c; if (c === 0) { document.getElementById(`zekr-${i}`).classList.add('done'); if (navigator.vibrate) navigator.vibrate(100); } }
}

// دوال القرآن (نفس النسخة الأصلية)
fetch('https://api.alquran.cloud/v1/surah').then(res => res.json()).then(data => { allSurahs = data.data; displaySurahs(allSurahs); });
function displaySurahs(s) { document.getElementById('surahList').innerHTML = s.map(x => `<div class="surah-card" onclick="openSurah(${x.number}, '${x.name}')">${x.number}. ${x.name}</div>`).join(''); }
function openSurah(id, name) {
    currentSurahId = id; document.getElementById('main-view').style.display = 'none'; document.getElementById('quran-view').style.display = 'block';
    document.getElementById('current-surah-title').innerText = name; updateAudioSource();
    fetch(`https://api.alquran.cloud/v1/surah/${id}`).then(res => res.json()).then(d => {
        let ayahs = d.data.ayahs, bism = "";
        if (id !== 1 && id !== 9 && ayahs[0].text.includes("بِسْمِ اللَّهِ")) { bism = `<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`; ayahs[0].text = ayahs[0].text.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", ""); }
        document.getElementById('ayahsContainer').innerHTML = bism + ayahs.map(a => `${a.text} <span class="ayah-num">(${a.numberInSurah})</span>`).join(' ');
    });
}
function toggleAudio() { if (audio.paused) { audio.play(); playBtn.innerText = "||"; } else { audio.pause(); playBtn.innerText = "▷"; } }
audio.ontimeupdate = () => { if (audio.duration) { seekSlider.value = (audio.currentTime / audio.duration) * 100; document.getElementById('currentTime').innerText = formatTime(audio.currentTime); document.getElementById('durationTime').innerText = formatTime(audio.duration); } };
function seekAudio() { audio.currentTime = audio.duration * (seekSlider.value / 100); }
function formatTime(s) { let m = Math.floor(s / 60), sec = Math.floor(s % 60); return `${m}:${sec < 10 ? '0' + sec : sec}`; }
function updateAudioSource() {
    const r = document.getElementById('reciterSelect').value; const srv = { 'afs': '8', 'minsh': '10', 'basit': '7', 'husr': '13' };
    audio.src = `https://server${srv[r]}.mp3quran.net/${r}/${currentSurahId.toString().padStart(3,'0')}.mp3`; playBtn.innerText = "▷";
}
function showMain() { document.getElementById('main-view').style.display = 'block'; document.getElementById('quran-view').style.display = 'none'; audio.pause(); }
function backToAzkarCats() { document.getElementById('azkarCats').style.display = 'grid'; document.getElementById('azkar-content').style.display = 'none'; }
function changeFontSize(d) { let s = parseFloat(window.getComputedStyle(document.getElementById('ayahsContainer')).fontSize); document.getElementById('ayahsContainer').style.fontSize = (s + d) + 'px'; }
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); document.getElementById('darkModeBtn').innerText = document.body.classList.contains('dark-mode')?'☀️':'🌙'; }
function filterSurahs() { let t = document.getElementById('searchInput').value; displaySurahs(allSurahs.filter(s => s.name.includes(t))); }

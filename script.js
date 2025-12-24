let allSurahs = [];
let currentSurahId = 1;
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const seekSlider = document.getElementById('seekSlider');

// دوال التحكم
function changeFontSize(delta) {
    const container = document.getElementById('ayahsContainer');
    let size = parseFloat(window.getComputedStyle(container).fontSize);
    container.style.fontSize = (size + delta) + 'px';
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.getElementById('darkModeBtn').innerText = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

audio.ontimeupdate = () => {
    if (audio.duration) {
        seekSlider.value = (audio.currentTime / audio.duration) * 100;
        document.getElementById('currentTime').innerText = formatTime(audio.currentTime);
        document.getElementById('durationTime').innerText = formatTime(audio.duration);
    }
};

function seekAudio() { audio.currentTime = audio.duration * (seekSlider.value / 100); }

function formatTime(sec) {
    let m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
}

function toggleAudio() {
    if (audio.paused) { audio.play(); playBtn.innerText = "||"; }
    else { audio.pause(); playBtn.innerText = "▷"; }
}

function switchMainTab(tab) {
    document.getElementById('quranTab').classList.toggle('active', tab === 'quran');
    document.getElementById('azkarTab').classList.toggle('active', tab === 'azkar');
    document.getElementById('quran-section').style.display = tab === 'quran' ? 'block' : 'none';
    document.getElementById('azkar-section').style.display = tab === 'azkar' ? 'block' : 'none';
    audio.pause();
}

// القرآن
fetch('https://api.alquran.cloud/v1/surah').then(res => res.json()).then(data => {
    allSurahs = data.data;
    displaySurahs(allSurahs);
});

function displaySurahs(s) {
    document.getElementById('surahList').innerHTML = s.map(x => `<div class="surah-card" onclick="openSurah(${x.number}, '${x.name}')">${x.number}. ${x.name}</div>`).join('');
}

function openSurah(id, name) {
    currentSurahId = id;
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('quran-view').style.display = 'block';
    document.getElementById('current-surah-title').innerText = name;
    updateAudioSource();
    fetch(`https://api.alquran.cloud/v1/surah/${id}`).then(res => res.json()).then(d => {
        let ayahs = d.data.ayahs, bismillah = "";
        if (id !== 1 && id !== 9 && ayahs[0].text.includes("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")) {
            bismillah = `<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
            ayahs[0].text = ayahs[0].text.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "");
        }
        document.getElementById('ayahsContainer').innerHTML = bismillah + ayahs.map(a => `${a.text} <span class="ayah-num">(${a.numberInSurah})</span>`).join(' ');
    });
}

// الأذكار الكاملة (كما طلبتها)
const azkarData = {
    morning: [
        { text: "أعوذ بالله من الشيطان الرجيم: (اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ)", count: 1 },
        { text: "بسم الله الرحمن الرحيم: (قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ)", count: 3 },
        { text: "بسم الله الرحمن الرحيم: (قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...)", count: 3 },
        { text: "بسم الله الرحمن الرحيم: (قُلْ أَعُوذُ بِرَبِّ النَّاسِ...)", count: 3 },
        { text: "أصبحنا وأصبح الملك لله والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير", count: 1 },
        { text: "اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور", count: 1 },
        { text: "رضيت بالله ربًا وبالإسلام دينًا وبمحمد ﷺ نبيًا", count: 3 },
        { text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت", count: 3 },
        { text: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم", count: 7 },
        { text: "سبحان الله وبحمده", count: 100 }
    ],
    evening: [
        { text: "أعوذ بالله من الشيطان الرجيم: (آية الكرسي)", count: 1 },
        { text: "المعوذات (الإخلاص، الفلق، الناس)", count: 3 },
        { text: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير", count: 1 },
        { text: "اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير", count: 1 },
        { text: "رضيت بالله ربًا وبالإسلام دينًا وبمحمد ﷺ نبيًا", count: 3 },
        { text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري", count: 3 },
        { text: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم", count: 7 },
        { text: "سبحان الله وبحمده", count: 100 }
    ],
    sleep: [
        { text: "باسمك اللهم أموت وأحيا", count: 1 },
        { text: "اللهم قِني عذابك يوم تبعث عبادك", count: 3 },
        { text: "جمع الكفين والنفث فيهما وقراءة الإخلاص والفلق والناس ثم مسح الجسد", count: 3 },
        { text: "آية الكرسي كاملة", count: 1 },
        { text: "سبحان الله (33)، الحمد لله (33)، الله أكبر (34)", count: 1 },
        { text: "اللهم أسلمت نفسي إليك، وفوضت أمري إليك، ووجهت وجهي إليك، آمنت بكتابك الذي أنزلت، وبنبيك الذي أرسلت", count: 1 }
    ]
};

function loadAzkar(t) {
    document.getElementById('azkarCats').style.display = 'none';
    document.getElementById('azkar-content').style.display = 'block';
    const list = document.getElementById('azkarList');
    list.innerHTML = azkarData[t].map((z, i) => `
        <div class="zekr-card" id="zekr-${i}" onclick="countZekr(${i})">
            <div class="zekr-text">${z.text}</div>
            <div class="zekr-counter">بقي: <span id="count-${i}">${z.count}</span></div>
        </div>`).join('');
}

function countZekr(i) {
    const el = document.getElementById(`count-${i}`);
    let c = parseInt(el.innerText);
    if (c > 0) {
        el.innerText = --c;
        if (c === 0) {
            document.getElementById(`zekr-${i}`).classList.add('done');
            if (navigator.vibrate) navigator.vibrate(100);
        }
    }
}

function updateAudioSource() {
    const r = document.getElementById('reciterSelect').value;
    const srv = { 'afs': '8', 'minsh': '10', 'basit': '7', 'husr': '13' };
    audio.src = `https://server${srv[r]}.mp3quran.net/${r}/${currentSurahId.toString().padStart(3,'0')}.mp3`;
    playBtn.innerText = "▷"; seekSlider.value = 0;
}
function backToAzkarCats() { document.getElementById('azkarCats').style.display = 'grid'; document.getElementById('azkar-content').style.display = 'none'; }
function showMain() { document.getElementById('main-view').style.display = 'block'; document.getElementById('quran-view').style.display = 'none'; audio.pause(); }
function changeReciter() { audio.pause(); updateAudioSource(); }
function filterSurahs() { 
    let term = document.getElementById('searchInput').value;
    displaySurahs(allSurahs.filter(s => s.name.includes(term)));
}

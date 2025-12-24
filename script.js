let allSurahs = [];
let currentSurahId = 1;
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');

// أداة التبديل بين القسمين
function switchMainTab(tab) {
    document.getElementById('quranTab').classList.remove('active');
    document.getElementById('azkarTab').classList.remove('active');
    
    if (tab === 'quran') {
        document.getElementById('quranTab').classList.add('active');
        document.getElementById('quran-section').style.display = 'block';
        document.getElementById('azkar-section').style.display = 'none';
        audio.pause();
    } else {
        document.getElementById('azkarTab').classList.add('active');
        document.getElementById('quran-section').style.display = 'none';
        document.getElementById('azkar-section').style.display = 'block';
        audio.pause();
    }
}

// --- قسم القرآن ---
fetch('https://api.alquran.cloud/v1/surah')
    .then(res => res.json())
    .then(data => {
        allSurahs = data.data;
        displaySurahs(allSurahs);
    });

function displaySurahs(surahs) {
    const list = document.getElementById('surahList');
    list.innerHTML = surahs.map(s => `
        <div class="surah-card" onclick="openSurah(${s.number}, '${s.name}')">
            ${s.number}. ${s.name}
        </div>
    `).join('');
}

function filterSurahs() {
    const term = document.getElementById('searchInput').value;
    displaySurahs(allSurahs.filter(s => s.name.includes(term)));
}

function openSurah(id, name) {
    currentSurahId = id;
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('quran-view').style.display = 'block';
    document.getElementById('current-surah-title').innerText = name;
    updateAudioSource();
    fetch(`https://api.alquran.cloud/v1/surah/${id}`)
        .then(res => res.json())
        .then(data => {
            let ayahs = data.data.ayahs;
            let bismillahHtml = "";
            if (id !== 1 && id !== 9 && ayahs[0].text.includes("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")) {
                bismillahHtml = `<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
                ayahs[0].text = ayahs[0].text.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "");
            }
            const textHtml = ayahs.map(a => `${a.text} <span class="ayah-num">(${a.numberInSurah})</span>`).join(' ');
            document.getElementById('ayahsContainer').innerHTML = bismillahHtml + textHtml;
        });
}

function updateAudioSource() {
    const reciter = document.getElementById('reciterSelect').value;
    const formattedId = currentSurahId.toString().padStart(3, '0');
    const servers = {
        'afs': `https://server8.mp3quran.net/afs/${formattedId}.mp3`,
        'minsh': `https://server10.mp3quran.net/minsh/${formattedId}.mp3`,
        'basit': `https://server7.mp3quran.net/basit/${formattedId}.mp3`,
        'husr': `https://server13.mp3quran.net/husr/${formattedId}.mp3`
    };
    audio.src = servers[reciter];
    playBtn.innerText = "تشغيل السورة ▷";
}

function toggleAudio() {
    if (audio.paused) { audio.play(); playBtn.innerText = "إيقاف مؤقت ||"; }
    else { audio.pause(); playBtn.innerText = "تشغيل السورة ▷"; }
}

function showMain() {
    document.getElementById('main-view').style.display = 'block';
    document.getElementById('quran-view').style.display = 'none';
}

// --- قسم الأذكار ---
const azkarData = {
    morning: [
        { text: "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له", count: 1 },
        { text: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك...", count: 1 },
        { text: "سبحان الله وبحمده", count: 100 }
    ],
    evening: [
        { text: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له", count: 1 },
        { text: "أعوذ بكلمات الله التامات من شر ما خلق", count: 3 }
    ],
    sleep: [
        { text: "باسمك ربي وضعت جنبي، وبك أرفعه", count: 1 },
        { text: "اللهم قني عذابك يوم تبعث عبادك", count: 3 }
    ]
};

function loadAzkar(type) {
    const titles = { morning: 'أذكار الصباح', evening: 'أذكار المساء', sleep: 'أذكار النوم' };
    document.getElementById('azkarCats').style.display = 'none';
    document.getElementById('azkar-content').style.display = 'block';
    document.getElementById('azkar-title').innerText = titles[type];
    
    const list = document.getElementById('azkarList');
    list.innerHTML = azkarData[type].map((z, index) => `
        <div class="zekr-card" id="zekr-${index}" onclick="countZekr(${index}, ${z.count})">
            <div class="zekr-text">${z.text}</div>
            <div class="zekr-counter">المرات المطلوبة: <span id="count-${index}">${z.count}</span></div>
        </div>
    `).join('');
}

function countZekr(index, max) {
    const countEl = document.getElementById(`count-${index}`);
    let current = parseInt(countEl.innerText);
    if (current > 0) {
        current--;
        countEl.innerText = current;
        if (current === 0) {
            document.getElementById(`zekr-${index}`).classList.add('done');
        }
    }
}

function backToAzkarCats() {
    document.getElementById('azkarCats').style.display = 'grid';
    document.getElementById('azkar-content').style.display = 'none';
}

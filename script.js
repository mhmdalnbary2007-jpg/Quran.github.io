let allSurahs = [];
let currentSurahId = 1;
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');

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
    
    document.getElementById('ayahsContainer').innerText = "جاري تحميل الآيات...";
    fetch(`https://api.alquran.cloud/v1/surah/${id}`)
        .then(res => res.json())
        .then(data => {
            let ayahs = data.data.ayahs;
            let bismillahHtml = "";

            // فصل البسملة عن أول آية (باستثناء سورة الفاتحة والتوبة)
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

function changeReciter() {
    audio.pause();
    updateAudioSource();
}

function toggleAudio() {
    if (audio.paused) { audio.play(); playBtn.innerText = "إيقاف مؤقت ||"; }
    else { audio.pause(); playBtn.innerText = "تشغيل السورة ▷"; }
}

function showMain() {
    audio.pause();
    document.getElementById('main-view').style.display = 'block';
    document.getElementById('quran-view').style.display = 'none';
}

let allSurahs = [];
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
    list.innerHTML = surahs.map(s => `<div class="surah-card" onclick="openSurah(${s.number}, '${s.name}')">${s.name}</div>`).join('');
}

function filterSurahs() {
    const term = document.getElementById('searchInput').value;
    displaySurahs(allSurahs.filter(s => s.name.includes(term)));
}

function openSurah(id, name) {
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('quran-view').style.display = 'block';
    document.getElementById('current-surah-title').innerText = name;
    const formattedId = id.toString().padStart(3, '0');
    audio.src = `https://server8.mp3quran.net/afs/${formattedId}.mp3`;
    fetch(`https://api.alquran.cloud/v1/surah/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('ayahsContainer').innerHTML = data.data.ayahs.map(a => `${a.text} <span class="ayah-num">(${a.numberInSurah})</span>`).join(' ');
        });
}

function toggleAudio() {
    if (audio.paused) { audio.play(); playBtn.innerText = "إيقاف مؤقت ||"; }
    else { audio.pause(); playBtn.innerText = "تشغيل السورة ▷"; }
}

function showMain() { audio.pause(); document.getElementById('main-view').style.display = 'block'; document.getElementById('quran-view').style.display = 'none'; }

// القسم الثالث: البرمجة (script.js)
const audio = document.getElementById('mainAudio');
const playBtn = document.getElementById('playBtn');
let isPlaying = false;

// 1. جلب السور عند فتح الموقع
fetch('https://api.alquran.cloud/v1/surah')
    .then(res => res.json())
    .then(data => {
        displaySurahs(data.data);
    });

function displaySurahs(surahs) {
    const list = document.getElementById('surahList');
    list.innerHTML = surahs.map(s => `
        <div class="surah-card" onclick="loadSurah(${s.number}, '${s.name}')">
            ${s.number}. ${s.name}
        </div>
    `).join('');
}

// 2. ميزة البحث
function filterSurahs() {
    let input = document.getElementById('searchInput').value;
    let cards = document.getElementsByClassName('surah-card');
    for (let card of cards) {
        card.style.display = card.innerText.includes(input) ? "block" : "none";
    }
}

// 3. تحميل السورة والصوت
function loadSurah(id, name) {
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('quran-display').style.display = 'block';
    document.getElementById('surah-title').innerText = name;
    
    // إعداد رابط الصوت (منصور السالمي كمثال جودة عالية)
    const surahId = id.toString().padStart(3, '0');
    audio.src = `https://server9.mp3quran.net/shur/` + surahId + `.mp3`; 
    resetAudio();

    // جلب النص
    fetch(`https://api.alquran.cloud/v1/surah/${id}`)
        .then(res => res.json())
        .then(data => {
            let text = data.data.ayahs.map(a => a.text).join(' ۝ ');
            document.getElementById('ayahs-container').innerText = text;
        });
}

function toggleAudio() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = "تشغيل السورة ▷";
    } else {
        audio.play();
        playBtn.innerText = "إيقاف مؤقت ||";
    }
    isPlaying = !isPlaying;
}

function resetAudio() {
    audio.pause();
    isPlaying = false;
    playBtn.innerText = "تشغيل السورة ▷";
}

function goBack() {
    resetAudio();
    document.getElementById('main-view').style.display = 'block';
    document.getElementById('quran-display').style.display = 'none';
}

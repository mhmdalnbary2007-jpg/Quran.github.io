let allSurahs = [];
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');

// 1. جلب السور
fetch('https://api.alquran.cloud/v1/surah')
    .then(res => res.json())
    .then(data => {
        allSurahs = data.data;
        displaySurahs(allSurahs);
    })
    .catch(err => console.error("خطأ في جلب السور:", err));

function displaySurahs(surahs) {
    const list = document.getElementById('surahList');
    list.innerHTML = surahs.map(s => `
        <div class="surah-card" onclick="openSurah(${s.number}, '${s.name}')">
            ${s.number}. ${s.name}
        </div>
    `).join('');
}

// 2. البحث
function filterSurahs() {
    const term = document.getElementById('searchInput').value;
    const filtered = allSurahs.filter(s => s.name.includes(term));
    displaySurahs(filtered);
}

// 3. فتح السورة وتشغيل صوت العفاسي
function openSurah(id, name) {
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('quran-view').style.display = 'block';
    document.getElementById('current-surah-title').innerText = name;
    
    // رابط صوت العفاسي (سيرفر 8)
    const formattedId = id.toString().padStart(3, '0');
    audio.src = `https://server8.mp3quran.net/afs/${formattedId}.mp3`;
    
    // جلب النص
    document.getElementById('ayahsContainer').innerText = "جاري تحميل الآيات...";
    fetch(`https://api.alquran.cloud/v1/surah/${id}`)
        .then(res => res.json())
        .then(data => {
            const text = data.data.ayahs.map(a => `${a.text} <span class="ayah-num">(${a.numberInSurah})</span>`).join(' ');
            document.getElementById('ayahsContainer').innerHTML = text;
        });
}

function toggleAudio() {
    if (audio.paused) {
        audio.play();
        playBtn.innerText = "إيقاف مؤقت ||";
    } else {
        audio.pause();
        playBtn.innerText = "تشغيل السورة ▷";
    }
}

function showMain() {
    audio.pause();
    playBtn.innerText = "تشغيل السورة ▷";
    document.getElementById('main-view').style.display = 'block';
    document.getElementById('quran-view').style.display = 'none';
}

let allSurahs = [], currentSurahId = 1;
let isMuted = localStorage.getItem('isMuted') === 'true';
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const seekSlider = document.getElementById('seekSlider');
const notifySound = document.getElementById('notificationSound');

// --- 1. الإعدادات العامة والقائمة ---
function toggleMenu() { document.getElementById('sideMenu').classList.toggle('open'); }
function toggleMute() { 
    isMuted = !isMuted; 
    localStorage.setItem('isMuted', isMuted); 
    document.getElementById('muteBtn').innerText = isMuted ? "🔇" : "🔊"; 
}
function playNotify() { 
    if (!isMuted && notifySound) { 
        notifySound.currentTime = 0; 
        notifySound.play().catch(e => console.log("Audio error")); 
    } 
}

// --- 2. نظام القرآن الكريم ---
fetch('https://api.alquran.cloud/v1/surah').then(res => res.json()).then(data => { 
    allSurahs = data.data; 
    displaySurahs(allSurahs); 
});

function displaySurahs(surahs) { 
    const list = document.getElementById('surahList');
    if(list) list.innerHTML = surahs.map(s => `<div class="surah-card" onclick="openSurah(${s.number}, '${s.name}')">${s.number}. ${s.name}</div>`).join(''); 
}

function filterSurahs() { 
    const term = document.getElementById('searchInput').value; 
    displaySurahs(allSurahs.filter(s => s.name.includes(term))); 
}

function openSurah(id, name) {
    currentSurahId = id;
    document.getElementById('sideMenu').classList.remove('open');
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('quran-view').style.display = 'block';
    document.getElementById('current-surah-title').innerText = name;
    updateAudioSource();
    fetch(`https://api.alquran.cloud/v1/surah/${id}`).then(res => res.json()).then(data => {
        document.getElementById('ayahsContainer').innerHTML = data.data.ayahs.map(a => `${a.text} <span style="color:var(--gold); font-size: 1.1rem;">(${a.numberInSurah})</span>`).join(' ');
    });
}

function showMain() { 
    document.getElementById('main-view').style.display = 'block'; 
    document.getElementById('quran-view').style.display = 'none'; 
    if(audio) audio.pause(); 
    if(playBtn) playBtn.innerText = "▷";
}

function updateAudioSource() {
    const r = document.getElementById('reciterSelect').value;
    const srv = { 'afs': '8', 'minsh': '10', 'basit': '7', 'husr': '13', 'maher': '12', 'qtm': '11', 'yasser': '11', 'shat': '11', 'ajm': '8', 'saud': '11' };
    audio.src = `https://server${srv[r] || '11'}.mp3quran.net/${r}/${currentSurahId.toString().padStart(3, '0')}.mp3`;
    if (!audio.paused) audio.play();
}

function toggleAudio() { 
    if (audio.paused) { audio.play(); playBtn.innerText = "||"; } 
    else { audio.pause(); playBtn.innerText = "▷"; } 
}

// --- 3. قاعدة بيانات الأذكار الكاملة (بدون حذف) ---
const azkarData = {
    morning: [
        { id: "m1", text: "أعوذ بالله من الشيطان الرجيم (آية الكرسي)", count: 1 },
        { id: "m2", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ (قل هو الله أحد) - سورة الإخلاص", count: 3 },
        { id: "m3", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ (قل أعوذ برب الفلق) - سورة الفلق", count: 3 },
        { id: "m4", text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ (قل أعوذ برب الناس) - سورة الناس", count: 3 },
        { id: "m5", text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1 },
        { id: "m6", text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", count: 1 },
        { id: "m7", text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ", count: 4 },
        { id: "m8", text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3 },
        { id: "m9", text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", count: 3 },
        { id: "m10", text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", count: 1 },
        { id: "m11", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
        { id: "m12", text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10 }
    ],
    evening: [
        { id: "e1", text: "أعوذ بالله من الشيطان الرجيم (آية الكرسي)", count: 1 },
        { id: "e2", text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1 },
        { id: "e3", text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3 },
        { id: "e4", text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", count: 10 },
        { id: "e5", text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", count: 7 }
    ],
    sleep: [
        { id: "s1", text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ", count: 1 },
        { id: "s2", text: "اللَّهُمَّ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا", count: 1 },
        { id: "s3", text: "سُبْحَانَ اللَّهِ", count: 33 },
        { id: "s4", text: "الْحَمْدُ لِلَّهِ", count: 33 },
        { id: "s5", text: "اللَّهُ أَكْبَرُ", count: 34 }
    ],
    afterPrayer: [
        { id: "p1", text: "أَسْتَغْفِرُ اللَّهَ", count: 3 },
        { id: "p2", text: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ", count: 1 },
        { id: "p3", text: "سُبْحَانَ اللَّهِ", count: 33 },
        { id: "p4", text: "الْحَمْدُ لِلَّهِ", count: 33 },
        { id: "p5", text: "اللَّهُ أَكْبَرُ", count: 33 }
    ],
    generalDuas: [
        { id: "d1", text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", count: 1 },
        { id: "d2", text: "لا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", count: 1 },
        { id: "d3", text: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", count: 1 },
        { id: "d4", text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ", count: 1 }
    ]
};

// --- 4. وظائف تشغيل الأذكار ---
function loadAzkar(cat) {
    const catsDiv = document.getElementById('azkarCats');
    const contentDiv = document.getElementById('azkar-content');
    if(catsDiv) catsDiv.style.display = 'none';
    if(contentDiv) contentDiv.style.display = 'block';
    
    const list = document.getElementById('azkarList');
    const titles = { morning: 'أذكار الصباح', evening: 'أذكار المساء', sleep: 'أذكار النوم', afterPrayer: 'بعد الصلاة', generalDuas: 'أدعية نبوية' };
    document.getElementById('azkar-title').innerText = titles[cat] || 'الأذكار';

    if(azkarData[cat]) {
        list.innerHTML = azkarData[cat].map(z => {
            let saved = localStorage.getItem(`zekr_${z.id}`);
            let cur = saved !== null ? parseInt(saved) : z.count;
            return `
                <div class="zekr-card ${cur === 0 ? 'completed' : ''}" onclick="countZekr('${z.id}')">
                    <div class="zekr-text">${z.text}</div>
                    <div class="zekr-counter">المتبقي: <span id="num-${z.id}">${cur}</span></div>
                </div>`;
        }).join('');
    }
}

function countZekr(id) {
    const el = document.getElementById(`num-${id}`);
    if (!el) return;
    let c = parseInt(el.innerText);
    if (c > 0) {
        c--; el.innerText = c;
        localStorage.setItem(`zekr_${id}`, c);
        if (c === 0) {
            el.closest('.zekr-card').classList.add('completed');
            playNotify(); 
        }
    }
}

function backToAzkarCats() { 
    document.getElementById('azkarCats').style.display = 'grid'; 
    document.getElementById('azkar-content').style.display = 'none'; 
}

function resetAzkarProgress() { 
    if (confirm("تصفير عدادات الأذكار؟")) { 
        Object.keys(localStorage).forEach(k => { if (k.startsWith('zekr_')) localStorage.removeItem(k); }); 
        location.reload(); 
    } 
}

// --- 5. السبحة والعدادات والهدف اليومي ---
let sCount = parseInt(localStorage.getItem('sebhaCount')) || 0;
let sGoal = parseInt(localStorage.getItem('sebhaGoal')) || 100;

function updateGoal() {
    const goalInput = document.getElementById('sebhaGoal');
    const statusMsg = document.getElementById('goalStatus');
    sGoal = parseInt(goalInput.value) || 100;
    localStorage.setItem('sebhaGoal', sGoal);
    updateProgress();
    if(statusMsg) {
        statusMsg.style.opacity = "1";
        setTimeout(() => statusMsg.style.opacity = "0", 2000);
    }
}

function incrementSebha() {
    sCount++;
    document.getElementById('sebhaCounter').innerText = sCount;
    localStorage.setItem('sebhaCount', sCount);
    updateProgress();
    if (sCount == sGoal) playNotify(); 
}

function updateProgress() {
    let percent = Math.min((sCount / sGoal) * 100, 100);
    const bar = document.getElementById('sebhaBar');
    if(bar) bar.style.width = percent + "%";
}

function resetSebha() {
    if(confirm("تصفير السبحة؟")) {
        sCount = 0;
        document.getElementById('sebhaCounter').innerText = 0;
        localStorage.setItem('sebhaCount', 0);
        updateProgress();
    }
}

function updateCountdown() {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow - now;
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    const timer = document.getElementById('countdown-timer');
    if(timer) timer.innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// --- 6. التنقل والخط والوضع المظلم ---
function switchMainTab(t) {
    document.querySelectorAll('.main-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(t + 'Tab').classList.add('active');
    ['quran-section', 'azkar-section', 'sebha-section'].forEach(s => { 
        const el = document.getElementById(s);
        if(el) el.style.display = s.startsWith(t) ? 'block' : 'none'; 
    });
}

function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
function changeFontSize(d) { 
    const el = document.getElementById('ayahsContainer'); 
    let s = window.getComputedStyle(el).fontSize; 
    el.style.fontSize = (parseFloat(s) + d) + 'px'; 
}

// تهيئة عند التشغيل
setInterval(updateCountdown, 1000);
document.getElementById('sebhaCounter').innerText = sCount;
document.getElementById('sebhaGoal').value = sGoal;
updateProgress();

// --- 1. PREMIUM ULTRA-SMOOTH KARA DELİK MOTORU (CANVAS 2D) ---
const container = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
container.appendChild(canvas);
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = window.innerWidth < 480 ? 120 : 250; // Mobil dostu, kasmayan ideal parçacık sayısı

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Kozmik toz parçacıklarının yapısı (Pürüzsüz akış)
class KozmikParcacik {
    constructor() {
        this.reset();
        this.angle = Math.random() * Math.PI * 2;
    }

    reset() {
        // Kara deliğin dışından başlayıp merkeze doğru çekilme mantığı
        this.radius = Math.random() * (Math.max(width, height) * 0.4) + 60;
        this.speed = (Math.random() * 0.015 + 0.005) * (120 / this.radius); // Kepler yörünge hızı
        this.size = Math.random() * 1.8 + 0.5;
        // İç kısımlar neon mavi, dış kısımlar mor/erguvan gaz bulutu
        this.color = this.radius < 150 ? 'rgba(0, 242, 254, ' + (Math.random() * 0.6 + 0.3) + ')' : 'rgba(157, 0, 255, ' + (Math.random() * 0.4 + 0.1) + ')';
    }

    update() {
        this.angle -= this.speed; // Saat yönünün tersine dönüş
        this.radius -= 0.12; // Yavaşça kara deliğin merkezine (olay ufkuna) çekilme

        if (this.radius < 35) { // Olay ufkuna giren parçacık yok olur ve dışarıda yeniden doğar
            this.reset();
        }
    }

    draw() {
        // Gravitational lensing (yerçekimsel bükülme) simülasyonu için pürüzsüz dairesel çizim
        const x = width / 2 + Math.cos(this.angle) * this.radius;
        const y = height / 2 + Math.sin(this.angle) * this.radius * 0.4; // 3D disk görünümü için dikey basıklık

        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Parçacıkları oluştur
for (let i = 0; i < particleCount; i++) {
    particles.push(new KozmikParcacik());
}

// Canlı Döngü (Render Loop)
function render() {
    // Kuyruklu yıldız efekti ve duman hissi için hafif şeffaf siyah arka plan örtüsü
    ctx.fillStyle = 'rgba(0, 0, 2, 0.08)';
    ctx.fillRect(0, 0, width, height);

    // 1. MERKEZDEKİ GERÇEK KARA DELİK VE OLAY UFKU GLOWU (Yerçekimi Işıması)
    const centerX = width / 2;
    const centerY = height / 2;

    // Dış parıltı (Aura)
    const aura = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 90);
    aura.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
    aura.addColorStop(0.4, 'rgba(157, 0, 255, 0.08)');
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.fillRect(centerX - 100, centerY - 100, 200, 200);

    // Gaz bulutlarını çiz ve güncelle
    ctx.globalCompositeOperation = 'screen'; // Işıkların üst üste binerek gerçekçi parlamasını sağlar
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    ctx.globalCompositeOperation = 'source-over';

    // TAM MERKEZ: Işığı bile yutan mutlak karanlık küre (Singularity)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();
    
    // Olay ufkunun keskin neon çizgisi
    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    requestAnimationFrame(render);
}
render();

// --- 2. DAKTİLO EFEKTİ SCRIPT'İ ---
const dynamicText = document.getElementById('dynamicText');
const words = [
    "Web Developer 🌐", 
    "Turning ideas into reality 💡", 
    "Focusing on clean code ✨", 
    "Always adapting, always learning 🚀"
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        dynamicText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        dynamicText.textContent = currentWord.substring(0, charIndex + 1);
    }
    if (!isDeleting) charIndex++;
    let typeSpeed = isDeleting ? 30 : 60;
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400; 
    }
    setTimeout(typeEffect, typeSpeed);
}
window.addEventListener('load', () => { setTimeout(typeEffect, 600); });

// --- 3. 💧 GERÇEK AKIŞKAN SIVI EFEKTİ ---
document.querySelectorAll('.liquid-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const liquidBg = this.querySelector('.liquid-bg');
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        liquidBg.style.width = this.offsetWidth + 'px';
        liquidBg.style.height = this.offsetWidth + 'px';
        liquidBg.style.left = x + 'px';
        liquidBg.style.top = y + 'px';
        
        liquidBg.classList.remove('animate');
        void liquidBg.offsetWidth; 
        liquidBg.classList.add('animate');
    });
});

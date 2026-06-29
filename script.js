// --- 1. SİMÜLE EDİLMİŞ CANLI KARA DELİK (THREE.JS) ---
let container = document.getElementById('canvas-container');
let camera, scene, renderer, particleSystem;
const particleCount = 2500; // Kara deliğin etrafındaki kozmik toz miktarı

initBlackHole();
animateBlackHole();

function initBlackHole() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 500; // Kara deliğe bakış mesafesi

    scene = new THREE.Scene();

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Her parçacığın özel yörünge verilerini saklamak için diziler
    window.particleData = [];

    const colorOuter = new THREE.Color('#9d00ff'); // Dış gaz bulutu (Mor)
    const colorInner = new THREE.Color('#00f2fe'); // Akreasyon diski içi (Mavi/Neon)

    for (let i = 0; i < particleCount; i++) {
        // Kara delik etrafında halkasal (spiral) dağılım matematiği
        const radius = Math.random() * 280 + 40; // Olay ufku sınırı
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.02 + 0.005) * (150 / radius); // Merkeze yakın olan daha hızlı döner (Kepler Kanunu)

        const x = Math.cos(angle) * radius;
        const y = (Math.random() - 0.5) * (radius * 0.15); // Diskin dikey kalınlığı
        const z = Math.sin(angle) * radius;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Merkeze yakınlık oranına göre renk geçişi (Mavi -> Mor)
        const mixRatio = (radius - 40) / 280;
        const mixedColor = colorInner.clone().lerp(colorOuter, mixRatio);

        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;

        window.particleData.push({ radius, angle, speed, yPos: y });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Toz bulutlarının parlaması için yuvarlak soft malzeme
    const material = new THREE.PointsMaterial({
        size: 3.0,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending, // Üst üste binen ışıkların parlamasını sağlar
        depthWrite: false
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animateBlackHole() {
    requestAnimationFrame(animateBlackHole);

    const positions = particleSystem.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
        let data = window.particleData[i];
        
        // Açıyı güncelle (Dönme hareketi)
        data.angle += data.speed;
        
        // Işığın yerçekimiyle bükülme ve yörünge simülasyonu
        positions[i * 3] = Math.cos(data.angle) * data.radius;
        positions[i * 3 + 1] = data.yPos + Math.sin(data.angle * 0.5) * 5; // Hafif yukarı aşağı dalgalanma
        positions[i * 3 + 2] = Math.sin(data.angle) * data.radius;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
    
    // Kamerayı hafifçe eğerek kara deliğe 3 boyutlu bir açıdan bakıyoruz (Sinematik görünüm)
    particleSystem.rotation.x = 0.4; 
    particleSystem.rotation.z = 0.1;

    renderer.render(scene, camera);
}

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

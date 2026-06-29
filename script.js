// --- 1. GERÇEK 3D MATRİS DALGA SİMÜLASYONU (THREE.JS) ---
const SEPARATION = 45, AMOUNTX = 65, AMOUNTY = 65;
let container = document.getElementById('canvas-container');
let camera, scene, renderer, particles;
let count = 0;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;
    camera.position.y = 400;
    camera.position.x = 100;

    scene = new THREE.Scene();

    const numParticles = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    let i = 0, j = 0;
    const colorBlue = new THREE.Color('#00f2fe');
    const colorPurple = new THREE.Color('#9d00ff');

    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
            positions[i + 1] = 0;
            positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);

            const mixRatio = ix / AMOUNTX;
            const mixedColor = colorBlue.clone().lerp(colorPurple, mixRatio);

            colors[j] = mixedColor.r;
            colors[j + 1] = mixedColor.g;
            colors[j + 2] = mixedColor.b;

            i += 3;
            j += 3;
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 3.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    const positions = particles.geometry.attributes.position.array;
    let i = 0;

    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i + 1] = (Math.sin((ix + count) * 0.2) * 60) +
                               (Math.sin((iy + count) * 0.1) * 60);
            i += 3;
        }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y = count * 0.03;

    renderer.render(scene, camera);
    count += 0.04;
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
    
    if (!isDeleting) {
        charIndex++;
    }
    
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

window.addEventListener('load', () => {
    setTimeout(typeEffect, 600);
});

// --- 3. 💧 AKIŞKAN SIVI BUTON EFEKTİ SCRIPT'İ ---
document.querySelectorAll('.liquid-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const liquidBg = this.querySelector('.liquid-bg');
        
        // Tıklanan noktanın koordinatlarını hesapla
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Efekt çapını ayarla ve tam tıklandığı noktaya ortala
        liquidBg.style.width = this.offsetWidth + 'px';
        liquidBg.style.height = this.offsetWidth + 'px';
        liquidBg.style.left = x + 'px';
        liquidBg.style.top = y + 'px';
        
        // Animasyonu sıfırla ve yeniden fırlat
        liquidBg.classList.remove('animate');
        void liquidBg.offsetWidth; // Tetikleyici (Reflow)
        liquidBg.classList.add('animate');
    });
});

// --- 1. PREMIUM COZMIC BLACK HOLE ENGINE ---
const container = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
container.appendChild(canvas);
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = window.innerWidth < 480 ? 400 : 900; 

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class TozBulutu {
    constructor() {
        this.reset();
        this.angle = Math.random() * Math.PI * 2;
    }

    reset() {
        this.radius = Math.random() * (Math.max(width, height) * 0.38) + 45;
        this.speed = (Math.random() * 0.008 + 0.003) * (140 / this.radius);
        this.size = Math.random() * 1.5 + 0.4;
        
        if (Math.random() > 0.2) {
            const alpha = Math.random() * 0.5 + 0.2;
            this.color = `rgba(255, ${Math.floor(Math.random() * 90 + 110)}, 30, ${alpha})`;
        } else {
            const alpha = Math.random() * 0.3 + 0.1;
            this.color = `rgba(160, 32, 240, ${alpha})`;
        }
    }

    update() {
        this.angle -= this.speed;
        this.radius -= 0.05;

        if (this.radius < 40) {
            this.reset();
        }
    }

    draw() {
        const x = width / 2 + Math.cos(this.angle) * this.radius;
        const y = height / 2 + Math.sin(this.angle) * this.radius * 0.32; 

        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new TozBulutu());
}

function render() {
    ctx.fillStyle = 'rgba(0, 0, 1, 0.08)';
    ctx.fillRect(0, 0, width, height);

    const cX = width / 2;
    const cY = height / 2;

    ctx.globalCompositeOperation = 'screen';
    const aura = ctx.createRadialGradient(cX, cY, 35, cX, cY, 150);
    aura.addColorStop(0, 'rgba(255, 120, 0, 0.18)');
    aura.addColorStop(0.5, 'rgba(130, 0, 255, 0.05)');
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.fillRect(cX - 200, cY - 200, 400, 400);

    particles.forEach(p => {
        p.update();
        p.draw();
    });
    ctx.globalCompositeOperation = 'source-over';

    ctx.beginPath();
    ctx.arc(cX, cY, 39, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cX, cY, 40, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 200, 100, 0.35)';
    ctx.lineWidth = 1.5;
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

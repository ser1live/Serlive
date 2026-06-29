// --- 1. SIFIR KASMA ULTRA-GERÇEKÇİ WEBGL SHADER MOTORU ---
const container = document.getElementById('canvas-container');
const canvas = document.createElement('canvas');
container.appendChild(canvas);
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

if (!gl) {
    console.error("WebGL desteklenmiyor!");
}

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

gl.viewport(0, 0, width, height);

// --- GLSL KODLARI (Uzay Bükülmesi ve Gaz Diski Matematiği) ---
const vertexShaderSource = `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;

    // Gerçekçi kozmik gaz dokusu için gürültü (Noise) fonksiyonu
    float noise(vec2 p) {
        return fraction(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    float snoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(noise(i + vec2(0.0,0.0)), noise(i + vec2(1.0,0.0)), u.x),
                   mix(noise(i + vec2(0.0,1.0)), noise(i + vec2(1.0,1.0)), u.x), u.y);
    }

    void main() {
        // Koordinatları merkeze göre eşitleme
        vec2 uv = (gl_FragCoord.xy - u_resolution.xy * 0.5) / u_resolution.y;
        
        // Kara deliği izometrik 3D açıya getirmek için uzayı hafifçe eğiyoruz (Fotoğraftaki gibi)
        uv = vec2(uv.x * 0.9 - uv.y * 0.4, uv.y * 0.5 + uv.x * 0.3);

        float r = length(uv);
        float angle = atan(uv.y, uv.x);

        // 1. Merkezdeki Mutlak Karanlık (Singularity & Olay Ufku)
        if (r < 0.09) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }

        // 2. Gravitational Lensing (Yerçekimsel Işık Bükülmesi) Etkisi
        // Merkez yaklaştıkça ışık bükülme katsayısı katlanarak artar
        float distortion = 0.015 / (r - 0.085);
        float adjustedRadius = r + distortion;

        // 3. Dönüşüm ve Pürüzsüz Akreasyon Diski (Kozmik Toz Bulutu)
        // Merkeze yakın yerler daha hızlı döner (Keplerian Disk simülasyonu)
        float speed = u_time * (0.8 / (adjustedRadius + 0.1));
        float diskAngle = angle + speed;

        // Gaz dokusunun katmanları (Fotoğraftaki dumanlı yapı için)
        float gasDensity = snoise(vec2(adjustedRadius * 15.0, diskAngle * 4.0)) * 0.5 + 0.5;
        gasDensity += snoise(vec2(adjustedRadius * 30.0, diskAngle * 8.0 - u_time)) * 0.25;

        // Diskin sınırları ve parlaması (Fotoğraftaki renk paleti: Turuncu/Beyaz/Mor geçişi)
        float disk = smoothstep(0.45, 0.12, adjustedRadius) * smoothstep(0.08, 0.16, adjustedRadius);
        
        // Yoğunluğa göre renkleri karıştırıyoruz
        vec3 colorInner = vec3(1.0, 0.85, 0.65); // Sıcak beyaz/sarı çekirdek parlaması
        vec3 colorMid = vec3(0.95, 0.45, 0.15);   // Fotoğraftaki ana turuncu şeritler
        vec3 colorOuter = vec3(0.45, 0.05, 0.6);  // Dış kısımdaki mor/erguvan gaz bulutları

        vec3 finalColor = mix(colorOuter, colorMid, smoothstep(0.35, 0.18, adjustedRadius));
        finalColor = mix(finalColor, colorInner, smoothstep(0.18, 0.11, adjustedRadius));
        
        // Gaz yoğunluğuyla rengi birleştirip parlatıyoruz
        finalColor *= (disk * (0.4 + gasDensity * 0.8));
        
        // Foton Halkası (Olay ufkunun hemen dışındaki ince çok parlak çember)
        float photonRing = smoothstep(0.008, 0.0, abs(r - 0.094));
        finalColor += vec3(1.0, 0.95, 0.85) * photonRing * 0.8;

        // Uzay boşluğunun genel karanlığıyla birleştirme
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

// --- SHADER DERLEME VE BAĞLAMA İŞLEMLERİ ---
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

// Dikdörtgen çizim alanı (Canvas'ı kapla)
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,   1, -1,  -1,  1,
    -1,  1,   1, -1,   1,  1,
]), gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
const timeLocation = gl.getUniformLocation(program, "u_time");

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    gl.viewport(0, 0, width, height);
});

// --- ANIMASYON DÖNGÜSÜ (RENDER LOOP) ---
function render(time) {
    time *= 0.001; // Saniyeye çevir

    gl.uniform2f(resolutionLocation, width, height);
    gl.uniform1f(timeLocation, time);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

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

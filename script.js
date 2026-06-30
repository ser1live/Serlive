// --- 📦 SWIPER 3D COVERFLOW MOTORU AYARLARI ---
var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 12,     
        stretch: 15,    
        depth: 100,     
        modifier: 1,
        slideShadows: false, 
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});

// --- 🎭 DAKTİLO EFEKTİ SCRIPT'İ ---
const dynamicText = document.getElementById('dynamicText');
const words = [
    "Error: 404 Sleep Not Found ☕", 
    "Turning coffee into clean code 🚀", 
    "Building digital universes 🌌", 
    "Code. Design. Deploy. Repeat. ✨"
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

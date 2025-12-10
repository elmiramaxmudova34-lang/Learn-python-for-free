// GSAP (GreenSock Animation Platform) va Three.js kutubxonalari index.html da ulangan.

// --- 1. Three.js Particle Wave Animation ---
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
// Kamera sozlamalari
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Zarrachalar (Particles) yaratish
const geometry = new THREE.BufferGeometry();
const count = 800000; // Ko'proq zarracha uchun 4000 ta
const posArray = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    // Katta maydonda tarqatish
    posArray[i] = (Math.random() - 0.5) * 20; 
}

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material (Zarracha ko'rinishi)
const material = new THREE.PointsMaterial({
    size: 0.025,
    color: 0x00f3ff, // Neon Cyan
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending, // Yana yorqinroq qilish uchun
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

camera.position.z = 5;

// Sichqoncha interaksiyasi
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Animatsiya sikli
const clock = new THREE.Clock();

function animate() {
    targetX = mouseX * 0.0005;
    targetY = mouseY * 0.0005;

    const elapsedTime = clock.getElapsedTime();

    // Zarrachalarga sekin harakat berish (Wave/Pulse)
    for(let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Zarrachalarni Y o'qida sinusoidal to'lqin effektida harakatlantirish
        posArray[i3 + 1] = Math.sin(elapsedTime * 0.5 + posArray[i3]) * 0.5 + Math.cos(elapsedTime * 0.5 + posArray[i3+2]) * 0.5;
    }
    geometry.attributes.position.needsUpdate = true; // Pozitsiya yangilanganini aytish

    // Sichqonchaga reaksiya
    particlesMesh.rotation.x += 0.03 * (targetY - particlesMesh.rotation.x);
    particlesMesh.rotation.y += 0.03 * (targetX - particlesMesh.rotation.y);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// Ekranni o'zgartirganda moslashish
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 2. Typewriter Effect (Yozuv effekti) ---
const textElement = document.getElementById('typewriter');
const phrases = ["Python Developer", "Web Creator", "Problem Solver", "3D Enthusiast"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        textElement.textContent = currentPhrase.substring(0, charIndex - 1) + "_";
        charIndex--;
        typeSpeed = 50;
    } else {
        textElement.textContent = currentPhrase.substring(0, charIndex + 1) + "_";
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; 
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }
    // Kursorni o'chirish-yoqish animatsiyasini olib tashlash
    if (charIndex !== 0 && charIndex !== currentPhrase.length + 1) {
        textElement.textContent = textElement.textContent.replace("_", "");
    }

    setTimeout(typeWriter, typeSpeed);
}
typeWriter();

// --- 3. GSAP Scroll Animations (Sahifa harakati) ---
gsap.registerPlugin(ScrollTrigger);

// Sectionlar harakatini GSAP yordamida boshqarish
gsap.utils.toArray('section:not(#home)').forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 85%", // Ekran 85% ga yetganda boshlash
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: "power2.out"
    });
});

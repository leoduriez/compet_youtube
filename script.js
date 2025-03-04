"use strict";

// Désactiver les écouteurs d'événements 'unload' et 'beforeunload' pour éviter les avertissements de dépréciation
const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'unload' || type === 'beforeunload') {
        // Ne pas ajouter l'écouteur d'événement déprécié
        return;
    }
    return originalAddEventListener.call(this, type, listener, options);
};

document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const nav = document.querySelector('.nav-container');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const parallaxSection = document.querySelector('.parallax-section');
    const parallaxBg = document.querySelector('.parallax-bg');
    const faqItems = document.querySelectorAll('.faq-item');

    // Gestion de la FAQ
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Ferme toutes les réponses
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = null;
                }
            });

            // Toggle la réponse actuelle
            item.classList.toggle('active');
            if (!isActive) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    // Variables pour le scroll
    let lastScroll = 0;
    let scrollTimer = null;
    let isScrolling = false;

    // Gestion du menu mobile
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Fermer le menu mobile lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Fonction principale de gestion du scroll
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(() => {
                // Gestion de la navigation
                if (currentScroll > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }

                // Effet parallaxe
                if (parallaxSection && parallaxBg) {
                    const rate = currentScroll * 0.5;
                    parallaxBg.style.transform = `translate3d(0, ${rate}px, 0)`;
                }

                lastScroll = currentScroll;
                isScrolling = false;
            });
        }
    }

    // Optimisation des performances avec throttling
    function throttleScroll() {
        if (scrollTimer === null) {
            scrollTimer = setTimeout(() => {
                handleScroll();
                scrollTimer = null;
            }, 10);
        }
    }

    // Écouteurs d'événements
    window.addEventListener('scroll', throttleScroll, { passive: true });

    // Défilement fluide pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Gestion du redimensionnement de la fenêtre
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }, 250);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', function() {
      const scrollPosition = window.pageYOffset;
      
      // Sélectionnez votre élément parallaxe
      const parallaxElement = document.querySelector('.parallax-container');
      
      // Calculez la position de l'image de fond basée sur le défilement
      // La valeur 0.5 détermine la vitesse de l'effet (plus petit = plus lent)
      if (parallaxElement) {
        parallaxElement.style.backgroundPositionY = (scrollPosition * 0.5) + 'px';
      }
    });
  });
  

function scrollToVideoSection() {
    const videoSection = document.getElementById('video-section');
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
// Animation de la barre de navigation
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
        // Scroll Down
        nav.classList.remove('scroll-up');
        nav.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
        // Scroll Up
        nav.classList.remove('scroll-down');
        nav.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Gestion des animations au scroll
function handleScrollAnimations() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in-section');
    });

    const fadeInElements = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    fadeInElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialisation des animations
document.addEventListener('DOMContentLoaded', function() {
    handleScrollAnimations();
    initShortsCarousel();
});

// Fonction d'initialisation du carrousel simple
function initShortsCarousel() {
    const carousel = document.querySelector('.simple-carousel');
    const items = document.querySelectorAll('.simple-carousel-item');
    const prevBtn = document.querySelector('.simple-carousel-prev');
    const nextBtn = document.querySelector('.simple-carousel-next');
    const dots = document.querySelectorAll('.simple-carousel-dot');
    
    if (!carousel || items.length === 0) return;
    
    let currentIndex = 0;
    let autoRotateInterval;
    
    // Fonction pour afficher un élément spécifique
    function showItem(index) {
        // Masquer tous les éléments
        items.forEach(item => {
            item.classList.remove('active');
        });
        
        // Afficher l'élément actif
        items[index].classList.add('active');
        
        // Mettre à jour les indicateurs
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
                dot.classList.add('bg-[#2E5FAA]');
                dot.classList.remove('bg-gray-300');
            } else {
                dot.classList.remove('active');
                dot.classList.remove('bg-[#2E5FAA]');
                dot.classList.add('bg-gray-300');
            }
        });
        
        currentIndex = index;
    }
    
    // Fonction pour passer au short suivant
    function nextShort() {
        const newIndex = (currentIndex + 1) % items.length;
        showItem(newIndex);
    }
    
    // Fonction pour passer au short précédent
    function prevShort() {
        const newIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(newIndex);
    }
    
    // Ajouter les écouteurs d'événements pour les boutons de navigation
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextShort();
        resetAutoRotate();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevShort();
        resetAutoRotate();
    });
    
    // Ajouter les écouteurs d'événements pour les indicateurs
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentIndex) {
                showItem(index);
                resetAutoRotate();
            }
        });
    });
    
    // Démarrer la rotation automatique
    function startAutoRotate() {
        autoRotateInterval = setInterval(nextShort, 5000);
    }
    
    // Réinitialiser la rotation automatique
    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }
    
    // Arrêter la rotation automatique lors de l'interaction
    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }
    
    // Ajouter des écouteurs pour arrêter/démarrer la rotation automatique
    carousel.addEventListener('mouseenter', stopAutoRotate);
    carousel.addEventListener('mouseleave', startAutoRotate);
    
    // Initialiser le carrousel
    showItem(0);
    startAutoRotate();
    
    // Support des gestes tactiles
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Seuil de détection du swipe
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe vers la gauche - next
            nextShort();
            resetAutoRotate();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe vers la droite - previous
            prevShort();
            resetAutoRotate();
        }
    }
}

// Gestion du curseur personnalisé
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(ring);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        ring.style.left = e.clientX + 'px';
        ring.style.top = e.clientY + 'px';
    });

    // Ajouter la classe hover sur les éléments interactifs
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .video-redirect-btn, .faq-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            ring.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            ring.classList.remove('hover');
        });
    });
});

// Gestion du menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});





// ANIMATION PARALLAX AVANCÉE
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner les couches parallax
    const parallaxLayers = {
        bg: document.querySelector('.layer-bg'),
        mid: document.querySelector('.layer-mid'),
        front: document.querySelector('.layer-front'),
        closest: document.querySelector('.layer-closest'),
        stars: document.querySelector('.stars-bg'),
        floatingElements: document.querySelectorAll('.floating-binary')
    };
    
    // Coefficients de vitesse pour chaque couche (plus le nombre est grand, plus le mouvement est important)
    const speedFactors = {
        bg: 0.05,      // Très lent (arrière-plan)
        mid: 0.1,      // Lent (milieu)
        front: 0.2,    // Moyen (avant-plan)
        closest: 0.3,  // Rapide (premier plan)
        stars: 0.03,   // Extrêmement lent (fond étoilé)
        floatingMin: 0.15, // Vitesse minimale pour les éléments flottants
        floatingMax: 0.25  // Vitesse maximale pour les éléments flottants
    };
    
    // Variables pour le suivi du défilement
    let lastScrollY = window.scrollY;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let ticking = false;
    
    // Fonction pour mettre à jour les transformations des couches parallax
    function updateParallaxLayers() {
        // Calculer la différence de défilement
        const scrollDiff = window.scrollY - lastScrollY;
        const scrollDirection = Math.sign(scrollDiff); // 1 pour descendre, -1 pour monter
        const scrollAmount = Math.abs(scrollDiff); // Quantité de défilement
        
        // Facteur de lissage pour rendre le mouvement plus fluide
        const smoothingFactor = 0.1;
        
        // Mettre à jour chaque couche avec un effet de parallaxe
        if (parallaxLayers.bg) {
            // La couche d'arrière-plan se déplace lentement dans la direction opposée au défilement
            const currentTransform = getTransformValues(parallaxLayers.bg);
            const newY = currentTransform.y - (scrollDiff * speedFactors.bg);
            parallaxLayers.bg.style.transform = `translate3d(0, ${newY}px, 0)`;
        }
        
        if (parallaxLayers.mid) {
            // La couche du milieu se déplace plus rapidement
            const currentTransform = getTransformValues(parallaxLayers.mid);
            const newY = currentTransform.y - (scrollDiff * speedFactors.mid);
            parallaxLayers.mid.style.transform = `translate3d(0, ${newY}px, 0)`;
        }
        
        if (parallaxLayers.front) {
            // La couche d'avant-plan se déplace encore plus rapidement
            const currentTransform = getTransformValues(parallaxLayers.front);
            const newY = currentTransform.y - (scrollDiff * speedFactors.front);
            parallaxLayers.front.style.transform = `translate3d(0, ${newY}px, 0)`;
        }
        
        if (parallaxLayers.closest) {
            // La couche la plus proche se déplace très rapidement
            const currentTransform = getTransformValues(parallaxLayers.closest);
            const newY = currentTransform.y - (scrollDiff * speedFactors.closest);
            parallaxLayers.closest.style.transform = `translate3d(0, ${newY}px, 0)`;
        }
        
        if (parallaxLayers.stars) {
            // Le fond étoilé se déplace très lentement
            const currentTransform = getTransformValues(parallaxLayers.stars);
            const newY = currentTransform.y - (scrollDiff * speedFactors.stars);
            parallaxLayers.stars.style.transform = `translate3d(0, ${newY}px, 0)`;
        }
        
        // Mettre à jour les éléments flottants avec des vitesses variables
        if (parallaxLayers.floatingElements) {
            parallaxLayers.floatingElements.forEach((element, index) => {
                // Chaque élément a une vitesse légèrement différente
                const elementSpeed = speedFactors.floatingMin + 
                    (index / parallaxLayers.floatingElements.length) * 
                    (speedFactors.floatingMax - speedFactors.floatingMin);
                
                // Récupérer la transformation actuelle
                const currentTransform = getTransformValues(element);
                
                // Calculer la nouvelle position Y avec un mouvement plus fluide
                const newY = currentTransform.y - (scrollDiff * elementSpeed);
                
                // Appliquer une légère rotation en fonction du défilement
                const rotationAmount = scrollDiff * 0.01 * (index % 2 === 0 ? 1 : -1);
                
                // Appliquer la nouvelle transformation avec rotation
                element.style.transform = `translate3d(0, ${newY}px, 0) rotate(${rotationAmount}deg)`;
                
                // Ajuster l'opacité en fonction de la position de défilement
                const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
                const opacity = Math.max(0.3, 1 - scrollPercent * 0.5);
                element.style.opacity = opacity;
                
                // Ajouter un effet de flou progressif
                const blur = Math.min(3, scrollPercent * 5);
                element.style.filter = `blur(${blur}px)`;
            });
        }
        
        // Mettre à jour la position de défilement
        lastScrollY = window.scrollY;
        ticking = false;
    }
    
    // Fonction pour extraire les valeurs de transformation actuelles
    function getTransformValues(element) {
        const transform = element.style.transform;
        let x = 0, y = 0, z = 0;
        
        if (transform && transform !== 'none') {
            const matches = transform.match(/translate3d\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
            if (matches) {
                x = parseFloat(matches[1]);
                y = parseFloat(matches[2]);
                z = parseFloat(matches[3]);
            } else {
                const translateYMatch = transform.match(/translateY\(([^)]+)\)/);
                if (translateYMatch) {
                    y = parseFloat(translateYMatch[1]);
                }
            }
        }
        
        return { x, y, z };
    }
    
    // Fonction pour ajouter un effet de parralaxe basé sur la position de la souris
    function handleMouseMove(e) {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // Calculer le déplacement de la souris par rapport au centre
                const mouseX = e.clientX - window.innerWidth / 2;
                const mouseY = e.clientY - window.innerHeight / 2;
                
                // Normaliser les valeurs (entre -1 et 1)
                const normalizedX = mouseX / (window.innerWidth / 2);
                const normalizedY = mouseY / (window.innerHeight / 2);
                
                // Appliquer un effet de parallaxe léger basé sur la position de la souris
                if (parallaxLayers.floatingElements) {
                    parallaxLayers.floatingElements.forEach((element, index) => {
                        const depth = 0.5 + (index / parallaxLayers.floatingElements.length) * 2;
                        const moveX = normalizedX * depth * 5;
                        const moveY = normalizedY * depth * 5;
                        
                        // Récupérer la transformation actuelle
                        const currentTransform = getTransformValues(element);
                        
                        // Combiner le mouvement de défilement avec le mouvement de la souris
                        element.style.transform = `translate3d(${moveX}px, ${currentTransform.y}px, 0)`;
                    });
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }
    
    // Optimiser les performances en limitant les appels d'animation lors du défilement
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateParallaxLayers();
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Ajouter l'effet de parallaxe basé sur la position de la souris
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Initialiser les positions
    updateParallaxLayers();
});

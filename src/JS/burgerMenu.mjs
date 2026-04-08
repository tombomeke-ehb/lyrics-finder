export function burgerMenu() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const burgerNav = document.getElementById('burgerNav');
    const burgerIcon = document.getElementById('burgerIcon');
    const closeIcon = document.getElementById('closeIcon');
    const menuContainer = document.getElementById('menuContainer');

    if (!burgerNav || !burgerIcon || !closeIcon || !menuContainer) {
        console.error('Burger menu elementen ontbreken!');
        return;
    }

    // Vervang iconen en herpak de nieuwe referenties
    burgerIcon.replaceWith(burgerIcon.cloneNode(true));
    closeIcon.replaceWith(closeIcon.cloneNode(true));

    const newBurgerIcon = document.getElementById('burgerIcon');
    const newCloseIcon = document.getElementById('closeIcon');
    let lastFocusedElement = null;
    let touchStartX = 0;
    let touchCurrentX = 0;

    const getFocusable = () => {
        return burgerNav.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    };

    const closeMenu = () => {
        burgerNav.classList.remove('active');
        burgerNav.classList.remove('menu-entered');
        menuContainer.classList.remove('open');
        newBurgerIcon.classList.remove('menu-open');
        document.body.classList.remove('menu-open');
        newBurgerIcon.setAttribute('aria-expanded', 'false');
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    };

    const openMenu = () => {
        lastFocusedElement = document.activeElement;
        burgerNav.classList.add('active');
        menuContainer.classList.add('open');
        newBurgerIcon.classList.add('menu-open');
        document.body.classList.add('menu-open');
        newBurgerIcon.setAttribute('aria-expanded', 'true');
        requestAnimationFrame(() => {
            burgerNav.classList.add('menu-entered');
            const focusable = getFocusable();
            if (focusable.length) {
                focusable[0].focus();
            }
        });
    };

    newBurgerIcon.setAttribute('aria-expanded', 'false');
    newBurgerIcon.setAttribute('aria-controls', 'burgerNav');
    burgerNav.setAttribute('aria-hidden', 'true');

    newBurgerIcon.addEventListener('click', () => {
        openMenu();
        burgerNav.setAttribute('aria-hidden', 'false');
    });

    newCloseIcon.addEventListener('click', () => {
        closeMenu();
        burgerNav.setAttribute('aria-hidden', 'true');
    });

    const navigateFromMenuLink = (event, link) => {
        event.preventDefault();
        event.stopPropagation();
        const targetHash = link.getAttribute('href');
        if (targetHash) {
            window.location.hash = targetHash;
        }
        burgerNav.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            closeMenu();
        }, 0);
    };

    const navLinks = burgerNav.querySelectorAll('a[href^="#/"]');
    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            navigateFromMenuLink(event, link);
        });

        link.addEventListener('touchend', (event) => {
            navigateFromMenuLink(event, link);
        }, { passive: false });
    });

    burgerNav.addEventListener('touchstart', (event) => {
        if (!burgerNav.classList.contains('active')) return;
        touchStartX = event.touches[0].clientX;
        touchCurrentX = touchStartX;
    }, { passive: true });

    burgerNav.addEventListener('touchmove', (event) => {
        if (!burgerNav.classList.contains('active')) return;
        touchCurrentX = event.touches[0].clientX;
    }, { passive: true });

    burgerNav.addEventListener('touchend', () => {
        if (!burgerNav.classList.contains('active')) return;
        const swipeDistance = touchCurrentX - touchStartX;
        if (swipeDistance > 70) {
            closeMenu();
            burgerNav.setAttribute('aria-hidden', 'true');
        }
    });

    if (window.__lyricsFinderOutsideClickHandler) {
        document.removeEventListener('pointerdown', window.__lyricsFinderOutsideClickHandler, true);
    }

    const outsideClickHandler = (event) => {
        if (!burgerNav.classList.contains('active')) return;

        const target = event.target;
        if (burgerNav.contains(target) || menuContainer.contains(target)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        closeMenu();
        burgerNav.setAttribute('aria-hidden', 'true');
    };

    window.__lyricsFinderOutsideClickHandler = outsideClickHandler;
    document.addEventListener('pointerdown', outsideClickHandler, true);

    if (window.__lyricsFinderEscHandler) {
        document.removeEventListener('keydown', window.__lyricsFinderEscHandler);
    }

    const escHandler = (event) => {
        if (event.key === 'Escape' && burgerNav.classList.contains('active')) {
            closeMenu();
            burgerNav.setAttribute('aria-hidden', 'true');
            return;
        }

        if (event.key === 'Tab' && burgerNav.classList.contains('active')) {
            const focusable = getFocusable();
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    };
    window.__lyricsFinderEscHandler = escHandler;
    document.addEventListener('keydown', escHandler);

    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}
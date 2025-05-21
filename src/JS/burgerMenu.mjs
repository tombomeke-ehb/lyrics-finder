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

    newBurgerIcon.addEventListener('click', () => {
        burgerNav.classList.add('active');
        menuContainer.classList.add('open');
        newBurgerIcon.classList.add('menu-open');
    });

    newCloseIcon.addEventListener('click', () => {
        burgerNav.classList.remove('active');
        menuContainer.classList.remove('open');
        newBurgerIcon.classList.remove('menu-open');
    });

    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}
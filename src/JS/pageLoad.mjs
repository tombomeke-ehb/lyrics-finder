import { hideError } from './errorHandling.mjs';

export function PageLoad(){
    const loadingOverlay = document.getElementById('loadingOverlay');
    const burgerNav = document.getElementById('burgerNav');
    const burgerIcon = document.getElementById('burgerIcon');
    const menuContainer = document.getElementById('menuContainer');

    const hideLoading = () => loadingOverlay && (loadingOverlay.style.display = 'none');

    hideLoading();
    burgerNav && burgerNav.classList.remove('active');
    menuContainer && menuContainer.classList.remove('open');
    burgerIcon && burgerIcon.classList.remove('menu-open');
    hideError();
};

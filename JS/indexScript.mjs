const loadingOverlay = document.getElementById('loadingOverlay');
const burgerNav = document.getElementById('burgerNav');
const burgerIcon = document.getElementById('burgerIcon');
const closeIcon = document.getElementById('closeIcon');
const menuContainer = document.getElementById('menuContainer');

loadingOverlay.style.display = 'flex';

burgerIcon.addEventListener('click', function() {
    burgerNav.classList.add('active');
    menuContainer.classList.add('open');
    burgerIcon.classList.add('menu-open');
});

closeIcon.addEventListener('click', function() {
    burgerNav.classList.remove('active');
    menuContainer.classList.remove('open');
    burgerIcon.classList.remove('menu-open');
});


window.addEventListener('DOMContentLoaded', function () {

    loadingOverlay.style.display = 'none';
    burgerNav.classList.remove('active');
    menuContainer.classList.remove('open');
    
});
function showError(msg) {
    let searchError = document.getElementById('searchError');
    if (!searchError) {
        searchError = document.createElement('div');
        searchError.id = 'searchError';
        searchError.classList.add('searchError');
        searchError.style.display = 'none';
        document.body.insertBefore(searchError, document.body.firstChild);
    }

    searchError.textContent = msg;
    searchError.style.display = 'block';
    setTimeout(() => {
        searchError.style.display = 'none';
    }, 3000);
}

export function setupHomePage() {
    console.log('succesfully exported and loaded function/script')
    const loadingOverlay = document.getElementById('loadingOverlay');
    const burgerNav = document.getElementById('burgerNav');
    const burgerIcon = document.getElementById('burgerIcon');
    const closeIcon = document.getElementById('closeIcon');
    const menuContainer = document.getElementById('menuContainer');

    if (!menuContainer || !burgerIcon || !burgerNav || !closeIcon) {
        showError('Een of meerdere menu-elementen zijn niet gevonden.');
      }

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

loadingOverlay.style.display = 'none';
console.log('hid overlay')
burgerNav.classList.remove('active');
menuContainer.classList.remove('open');
}
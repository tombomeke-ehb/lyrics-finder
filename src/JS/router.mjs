class Router {
    constructor(routes){
        this.routes = routes;
        this.rootElem = document.getElementById('app');

        // Luister naar hash changes
        window.addEventListener('hashchange', () => this.handleRouteChange());

        // Trigger initiele pagina load
        this.handleRouteChange();
    }

    handleRouteChange() {
        // verwijder de # uit de hash
        const path = window.location.hash.slice(1) || '/';

        // Vind de juiste route handler
        const route = this.routes[path] || this.routes['/404'];
        if (typeof route !== 'function' || !this.rootElem) {
            return;
        }

        this.rootElem.innerHTML = '';

        route(this.rootElem);
        this.rootElem.classList.remove('page-enter');
        requestAnimationFrame(() => {
            this.rootElem.classList.add('page-enter');
        });
    }
}

export default Router;
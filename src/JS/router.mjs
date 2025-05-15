class Router {
    constructor(routes){
        this.routes = routes;
        this.rootElem = document.getElementById('app');

        // Luister naar hash changes
        window.addEventListener('hashchange', () => this.handeleRouteChange());

        // Trigger initiele pagina load
        this.handeleRouteChange();
    }

    handeleRouteChange() {
        // verwijder de # uit de hash
        const path = window.location.hash.slice(1) || '/';

        // Vind de kuiste route handler
        const route = this.routes[path] || this.route['/404'];

        this.rootElem.innerHTML = '';

        route (this.rootElem);
    }
}

export default Router;
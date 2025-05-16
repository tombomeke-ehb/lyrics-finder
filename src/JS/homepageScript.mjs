import { burgerMenu } from './burgerMenu.mjs';
import { PageLoad } from './pageLoad.mjs';
import { applyThemeFromStorage } from './themeUtils.mjs';

export function setupHomePage() {
    burgerMenu();
    PageLoad();
    applyThemeFromStorage();
    console.log('Home page loaded');

};
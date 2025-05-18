import { burgerMenu } from './burgerMenu.mjs';
import { PageLoad } from './pageLoad.mjs';
import { applySettingsFromStorage } from './themeUtils.mjs';

export function setupHomePage() {
    burgerMenu();
    PageLoad();
    applySettingsFromStorage
    console.log('Home page loaded');

};
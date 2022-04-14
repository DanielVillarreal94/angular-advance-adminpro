import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private linkTheme = document.querySelector('#theme');

  constructor() {
    const url = './assets/css/colors/blue-dark.css'

    const urlLocalStorage = localStorage.getItem('theme') || url;
    this.linkTheme?.setAttribute('href', urlLocalStorage);
  }

  changeTheme(theme: string) {
    const url = `./assets/css/colors/${theme}.css`
    this.linkTheme?.setAttribute('href', url);

    localStorage.setItem('theme', url);
  }

  checkCurrencyTheme(links: NodeListOf<Element> | undefined ) {
    links?.forEach((link) => {
    link.classList.remove('working');
    const btnTheme = link.getAttribute('data-theme');
    const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`
    const currentTheme = this.linkTheme?.getAttribute('href');
    if (btnThemeUrl === currentTheme) {
      link.classList.add('working');
    }
  });
}

}




import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linktTheme = document.querySelector('#theme');// se comunica el id pulsado

  constructor() {
    // ./assets/css/colors/default-dark.css tema defecto
    // const urlTheme = localStorage.getItem('theme') || './assets/css/colors/default-dark.css';

    // this.linktTheme.setAttribute('href', urlTheme);
    // localStorage.setItem('theme', urlTheme);//guardar preferencia en localstorage
   }


   changeTheme(theme:string){ //recibe la data del boton por medio de la clase theme:string
    //console.log('Cambio theme', theme);

    // const urlTheme = `./assets/css/colors/${theme}.css`;
    // this.linktTheme.setAttribute('href', urlTheme);//cambia el atributo
    // localStorage.setItem('theme', urlTheme);//guardar preferencia en localstorage
    this.checkCurrentTheme();// se llama la funcion despues de haber presionado el boton
  }

  checkCurrentTheme(){

    const links = document.querySelectorAll('.selector');

    links.forEach(elem => {

      elem.classList.remove('working'); //elimina la clase a cambiar
      const btnTheme = elem.getAttribute('data-theme');
      // const btnThemeUrl= `./assets/css/colors/${btnTheme}.css`;
      // const currentTheme = this.linktTheme.getAttribute('href');

      // if(btnTheme === currentTheme){
      //   elem.classList.add('working');
      // }

    })
  }



}

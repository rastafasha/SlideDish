import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule, RouterModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  public identity:any;

  private usuarioService = inject(UsuarioService)

  ngOnInit(){
    let USER = localStorage.getItem('user');
      if(USER){
        this.identity = JSON.parse(USER);
        console.log(this.identity);
      }

  }

   closeMenu() {
    const menuLateral = document.getElementsByClassName("sidemenu");
    for (let i = 0; i < menuLateral.length; i++) {
      menuLateral[i].classList.remove("active");
    }
  }

  logout(){
      this.usuarioService.logout();
    }

}

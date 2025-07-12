import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  bandejaList: any[] = [];
  // public bandejaList: number = 0;
  totalList : number = 0;

  constructor() {
      this.loadBandejaListFromLocalStorage();
    }

    loadBandejaListFromLocalStorage() {
    const storedItems = localStorage.getItem('bandejaItems');
    if (storedItems) {
      this.bandejaList = JSON.parse(storedItems);
      //contamos el total de items
      this.totalList = this.bandejaList.length;

    }
  }


  get iconBagColorClass(): string {
    const colors = ['icon-bag-red', 'icon-bag-black', 'icon-bag-yellow'];
    if(this.totalList > 0){
      return colors[this.totalList % colors.length];
    }
    return '';
  }

}

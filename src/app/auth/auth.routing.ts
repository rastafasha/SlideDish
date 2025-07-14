import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';

//pages



const routes: Routes = [


  //auth
    { path: 'registro', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'recovery-password', component: RecoveryComponent },

  //   { path: '', component: HomeComponent},
  // { path: 'home', component: HomeComponent},
  // { path: 'cursos', component: CursosComponent},
  // { path: 'curso/:id', component: CursoComponent},
  // { path: 'productos', component: ProductosComponent},
  // { path: 'producto/:slug', component: ProductoComponent},
  // // { path: 'producto/:id', component: ProductoComponent},
  // { path: 'blogs', component: BlogListComponent},
  // { path: 'blog/:id', component: BlogDetailComponent},
  // { path: 'about', component: AboutIndexComponent},
  // { path: 'about/:id', component: AboutComponent},
  // { path: 'faq', component: FaqComponent},
  // { path: 'cart', component: CarritoComponent},
  // { path: 'privacy-policy', component: PrivacypolicyComponent},
  // { path: 'contact', component: ContactComponent},
  // // { path: 'category/:id', component: CategoriasComponent},
  // { path: 'category/:nombre', component: CategoriasComponent},
  // { path: 'search/:termino', component: SearchComponent},
];




@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule {}

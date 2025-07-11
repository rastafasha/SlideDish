import { Routes } from '@angular/router';
import { ReviewOrderComponent } from './pages/review-order/review-order.component';
import { HomeComponent } from './pages/home/home.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

export const routes: Routes = [
    {
        path:'',
        component: HomeComponent
    },
    {
        path:'review',
        component: ReviewOrderComponent
    },
    {
        path:'checkout',
        component: CheckoutComponent
    },
];

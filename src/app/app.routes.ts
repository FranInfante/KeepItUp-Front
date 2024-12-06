import { Routes } from '@angular/router';
import { LoginComponent } from './modules/logreg/+login/login.component';
import { RegisterComponent } from './modules/logreg/register/register.component';

export const routes: Routes = [
    {path: "", component: LoginComponent},
    {path: "register", component: RegisterComponent}
];

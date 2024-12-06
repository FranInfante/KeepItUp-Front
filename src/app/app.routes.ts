import { Routes } from '@angular/router';
import { LoginComponent } from './modules/logreg/+login/login.component';
import { RegisterComponent } from './modules/logreg/register/register.component';
import { MenuComponent } from './modules/+menu/menu.component';
import { WeighinsComponent } from './modules/+weighins/weighins.component';
import { WorkoutsComponent } from './modules/+workouts/workouts.component';

export const routes: Routes = [
    {path: "", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "menu", component: MenuComponent},
    {path: "weighins", component: WeighinsComponent},
    {path: "workouts", component: WorkoutsComponent}
];

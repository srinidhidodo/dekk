import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardViewDetailsComponent } from './pages/card-view-details/card-view-details.component';
import { LoginComponent } from './pages/login/login.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { StudyCardComponent } from './pages/study-card/study-card.component';

const routes: Routes = [
  { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },
  { path: 'search-results', component: SearchResultsComponent, pathMatch: 'full' },
  { path: 'card-view-details', component: CardViewDetailsComponent, pathMatch: 'full' },
  { path: 'study-card', component: StudyCardComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'sign-up', component: SignUpComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '/pages/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

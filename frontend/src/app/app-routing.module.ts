import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutsModule } from './common/layouts';
import { CommonLayoutComponent } from './common/layouts/common-layout';
import { DashboardComponent } from './pages/dashboard';
import { DekkStudyComponent } from './pages/dekk-study/dekk-study.component';
import { DekkViewComponent } from './pages/dekk-view/dekk-view.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },
        { path: 'app', component: CommonLayoutComponent, children: [
          { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
          { path: 'dekk-view', component: DekkViewComponent, pathMatch: 'full' },
          { path: 'dekk-study', component: DekkStudyComponent, pathMatch: 'full' },
          { path: 'search-results', component: SearchResultsComponent, pathMatch: 'full' },
          { path: '**', redirectTo: '/ypages/404' },
        ] },
        { path: '**', redirectTo: '/pages/404' },
      ],
      { useHash: true },
    ),
    LayoutsModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatChipsModule } from "@angular/material/chips";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";

import { NgMatSearchBarModule } from 'ng-mat-search-bar';
import { FormsModule } from '@angular/forms';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { SearchResultComponent } from './common/components/search-result/search-result.component';
import { HttpClientModule } from '@angular/common/http';
import { CardViewDetailsComponent } from './pages/card-view-details/card-view-details.component';
import { CardFrontComponent } from './common/components/card/card-front/card-front.component';
import { StudyCardComponent } from './pages/study-card/study-card.component';
import { CardBackComponent } from './common/components/card/card-back/card-back.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HomeComponent } from './pages/home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchResultComponent,
    SearchResultsComponent,
    CardViewDetailsComponent,
    CardFrontComponent,
    CardBackComponent,
    StudyCardComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ScrollingModule,
    HttpClientModule,
    NgMatSearchBarModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatListModule,
    MatChipsModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

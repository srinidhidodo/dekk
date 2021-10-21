import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  email: string;
  username: string;
  password: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  signUp() : void {
    // I do nothing
  }
}

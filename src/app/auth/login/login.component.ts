import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  test: Date = new Date();
  public isCollapsed = true;

  constructor(private router: Router) {}

  ngOnInit() {
    var html = document.getElementsByTagName('html')[0];
    html.classList.add('auth-layout');
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('bg-default');
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  ngOnDestroy() {
    var html = document.getElementsByTagName('html')[0];
    html.classList.remove('auth-layout');
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('bg-default');
  }
}

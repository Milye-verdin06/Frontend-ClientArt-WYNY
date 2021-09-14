import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { authenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  test: Date = new Date();
  public isCollapsed = true;

  constructor(
    private router: Router,
    private authServ: authenticationService,
    private route: ActivatedRoute,
    private authenticationService: authenticationService
  ) {}

  ngOnInit() {
    var html = document.getElementsByTagName('html')[0];
    html.classList.add('auth-layout');
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('bg-default');
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });

    let s_usr: string = '';
    let s_psw: string = '';
    let s_clv: string = '';
    let s_code: string = '';
    this.route.queryParams.subscribe((p) => {
      /* s_usr = p['mUsr'];
      s_psw = p['mPsw'];
      s_clv = p['mClv']; */
      s_code = p['code']; //retrieve param 'code'
      s_code = atob(s_code); //decode 'code'
      var code_splitted = s_code.split('&');
      s_usr = code_splitted[0];
      s_psw = code_splitted[1];
      s_clv = code_splitted[2];
      //console.log(s_usr);

      skipLocationChange: true;

      this.authenticationService.login(s_usr, s_psw).subscribe(
        (resp) => {
          environment.token = resp.access_token;
          let bodyU = {
            usr: s_usr,
            psw: s_psw,
            clv: s_clv,
          };
          this.authenticationService.loginUsuario(bodyU).subscribe(
            (r2) => {
              environment.usr = r2.usr;
              environment.fds = r2.fds;
              environment.nom = r2.nom;
              this.router.navigate(['/articulos-cliente']);
            },
            (er2) => console.log(er2)
          );
        },
        (error) => console.log(error)
      );
    });
  }

  ngOnDestroy() {
    var html = document.getElementsByTagName('html')[0];
    html.classList.remove('auth-layout');
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('bg-default');
  }
}

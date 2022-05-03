import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public auth2: any;
  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['123456', Validators.required],
    rememberMe: [false]
  });

  constructor(private router: Router,
    private fb: FormBuilder,
    private userService: UsuarioService,
    private ngZone: NgZone) { }


  ngOnInit(): void {
    this.renderButton();
  }

  login() {
    if (this.loginForm.invalid) return;

    this.userService.login(this.loginForm.value)
      .subscribe(resp => {
        if (this.loginForm.get('rememberMe')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('email');
        }

        // Navergar al dashboard
        this.router.navigateByUrl('/');
      }, (err) => {
        // Si sucede un error
        Swal.fire('Error', err.error.msg, 'error');
      });

    console.log(this.loginForm.value);
  }

  onSuccess(googleUser: any) {
    var id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
  }

  onFailure(error: any) {
    console.log(error);
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });

    this.startApp();
  }

  async startApp() {

    await this.userService.googleInit();
    this.auth2 = this.userService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));
}

  // Metodo propio de google
  attachSignin(element: any) {

    this.auth2.attachClickHandler(element, {},
      (googleUser: any) => {
        const id_token = googleUser.getAuthResponse().id_token;
        //console.log(id_token);
        this.userService.loginGoogle( id_token )
            .subscribe( resp => {
              // Navergar al dashboard
              this.ngZone.run( () => {
                this.router.navigateByUrl('/');
              });
            });


      }, (error: any) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }
}

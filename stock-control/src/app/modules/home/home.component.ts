import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';
import { CookieService } from 'ngx-cookie-service'
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy, AfterViewInit {

  //o ponto de exclamaação eh para iniciar a propriedade como
  //vazio e nao nulo
  @ViewChild('emailInput') public emailInputRef!: ElementRef;
  @ViewChild('passwordInput') public passwordInputRef!: ElementRef;

  private destroy$ = new Subject<void>();
  loginCard = true
  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  signupForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    name: ['', Validators.required]
  })

  constructor(private formBuilder: FormBuilder,
                private userService: UserService,
                private cookieService: CookieService,
                private messageService: MessageService,
                private router: Router){}


  ngAfterViewInit(): void {
    this.emailInputRef.nativeElement.value = 'Seu email aqui';
  }

  //Cookies sao mais seguros que o Local Storage, eh visto como
  //uma boa pratica tal armazenamento
  //Operador JS "?" valida se o valor existe para evitar o envio de erro
  onSubmitLoginForm(): void {
    if(this.loginForm.value && this.loginForm.valid){
      this.userService.authUser(this.loginForm.value as AuthRequest)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          if(response) {
            this.cookieService.set('USER_INFO', response?.token);
            this.loginForm.reset();
            this.router.navigate(['/dashboard']);
            this.messageService.add ({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Bem Vindo de volta, ${response?.name}!`,
              life: 3000
            })
          }
        },
        error: (err) => {
          this.messageService.add ({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao fazer o login!`,
            life: 2000
          })
          console.log(err);
        }
      })
    }
  }

  // o 'as' eh um casting de tipo
  onSubmitSignupForm(): void {
    if(this.signupForm.value && this.signupForm.valid) {
      this.userService.signupUser(
        this.signupForm.value as SignupUserRequest)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (response) => {
            if(response) {
              this.signupForm.reset();
              this.loginCard = true;
              this.messageService.add ({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Usuário, ${response?.name}, criado com sucesso!`,
                life: 3000
              })
            }
          },
          error: (err) => {
            this.messageService.add ({
              severity: 'error',
              summary: 'Error',
              detail: `Erro ao criar usuário!`,
              life: 2000
            })
            console.log(err)}
        })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}

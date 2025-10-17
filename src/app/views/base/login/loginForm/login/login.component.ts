import { Component } from '@angular/core';
import { NgStyle, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../services/auth/login/auth.service';
import { ToastService } from '../../../../../services/utilities/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    FormsModule,

  ]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.toast.showToast.error({ message: 'ایمیل و رمز عبور را وارد کنید.' });
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.isSucceeded) {
          this.toast.showToast.success({ message: 'ورود با موفقیت انجام شد' });
          this.router.navigate(['/dashboard']);
        } else {
          this.toast.showToast.error({ message: res.message || 'ورود ناموفق بود' });
        }
      },
      error: (err) => {
        this.loading = false;
        this.toast.showToast.error({ message: 'خطا در برقراری ارتباط با سرور' });
      }
    });
  }
}

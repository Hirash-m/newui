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
import { ApiResult } from 'src/app/dto/api-result';

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
      this.toast.error('لطفاً ایمیل و رمز عبور را وارد کنید');
      return;
    }
  
    this.loading = true;
  
    this.authService.login(this.email, this.password).subscribe({
      next: (res: ApiResult<any>) => {
        this.loading = false;
  
        if (res.isSucceeded && res.data?.token) {
          this.toast.success('ورود با موفقیت انجام شد');
          this.router.navigate(['/dashboard']);
          
        } else {
          // این قسمت حیاتی است!
          const errorMsg = res. message || res.errors?.join(', ') || 'ورود ناموفق';
          this.toast.error(errorMsg);
        }
      },
      error: (err) => {
        this.loading = false;
        this.toast.error('خطا در ارتباط با سرور');
        console.error('HTTP Error:', err);
      }
    });
  }
}

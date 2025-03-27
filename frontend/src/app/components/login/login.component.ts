import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  loginMessage = '';
  loginSuccess = false;
  isLoading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true; // Start loading
    this.authService.login(this.credentials.email, this.credentials.password).subscribe(
      (response) => {
        this.authService.setToken(response.token);
        this.loginSuccess = true;
        this.loginMessage = '✅ Login successful!';

        setTimeout(() => {
          this.redirectUser();
        }, 1000);
      },
      (error) => {
        this.loginSuccess = false;
        this.loginMessage = '❌ Invalid credentials!';
      }
    ).add(() => this.isLoading = false); // Stop loading after response
  }

  private redirectUser() {
    const userRole = this.authService.getUserRole();

    if (userRole === 'ADMIN') {
      this.router.navigate(['/dashboard']); // Admin → Dashboard
    } else if (userRole === 'VISITOR') {
      this.router.navigate(['/fire-management']); // Company → Fire Management
    } else {
      this.router.navigate(['/alert-list']); // Guest → Alert List (Lecture seule)
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

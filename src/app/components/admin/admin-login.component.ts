import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-login',
  standalone: true,
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
  imports: [CommonModule, FormsModule],
})
export class AdminLoginComponent {
  userId = '';
  password = '';
  error = '';

  login() {
    if (this.userId === 'superadmin' && this.password === 'superadmin') {
      sessionStorage.setItem('adminLoggedIn', 'true');
      window.location.reload();
    } else {
      this.error = 'Invalid credentials';
    }
  }
}

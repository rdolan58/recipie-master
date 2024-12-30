import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetService } from '@core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.sass'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ResetComponent implements OnInit {
  resetPasswordForm: FormGroup = this.fb.group({}); // Initialize as empty form group
  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';
  token: string = ''; // Initialize as an empty string

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private passwordResetService: PasswordResetService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.matchPasswords,
      }
    );
  }

  matchPasswords(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    const { password } = this.resetPasswordForm.value;

    this.passwordResetService.resetPassword(this.token, password).subscribe({
      next: () => {
        this.successMessage = 'Password reset successful. You can now log in.';
        this.errorMessage = '';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/']), 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error resetting password. Try again later.';
        this.successMessage = '';
        this.loading = false;
        console.error('Password reset error:', err); // Log the full error for debugging
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PasswordResetService } from '@core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.sass'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ForgotComponent implements OnInit {
  forgotPasswordForm: FormGroup = this.fb.group({}); // Initialize as empty form group
  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private passwordResetService: PasswordResetService) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    const email = this.forgotPasswordForm.value.email;

    this.passwordResetService.sendResetEmail(email).subscribe({
      next: () => {
        this.successMessage = 'Password reset link sent to your email.';
        this.errorMessage = '';
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error sending reset email. Try again later.';
        this.successMessage = '';
        this.loading = false;
      },
    });
  }
}

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { PasswordResetService } from '@core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-forgot',
//   templateUrl: './forgot.component.html',
//   styleUrls: ['./forgot.component.sass'],
//   standalone: true, // Ensure standalone is declared
//   imports: [CommonModule, ReactiveFormsModule], // Ensure imports are valid
// })
// export class ForgotComponent implements OnInit {
//   forgotPasswordForm: FormGroup;
//   submitted = false;
//   loading = false;
//   successMessage = '';
//   errorMessage = '';

//   constructor(private fb: FormBuilder, private passwordResetService: PasswordResetService) {}

//   ngOnInit(): void {
//     this.forgotPasswordForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//     });
//   }

//   onSubmit(): void {
//     this.submitted = true;

//     if (this.forgotPasswordForm.invalid) {
//       return;
//     }

//     this.loading = true;
//     const email = this.forgotPasswordForm.value.email;

//     this.passwordResetService.sendResetEmail(email).subscribe({
//       next: () => {
//         this.successMessage = 'Password reset link sent to your email.';
//         this.errorMessage = '';
//         this.loading = false;
//       },
//       error: () => {
//         this.errorMessage = 'Error sending reset email. Try again later.';
//         this.successMessage = '';
//         this.loading = false;
//       },
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { AuthService } from '@core';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FeatherModule,
    RouterLink,
  ],
})
export class SigninComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  submitted = false;
  returnUrl!: string;
  error = '';
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ['rdolan', Validators.required],
      password: ['usuck021', Validators.required],
      remember: [''],
    });

    this.error = localStorage.getItem("LoginFormError") ?? '';

  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent default form submission behavior
  
    this.submitted = true; // Mark form as submitted
    this.error = ''; // Clear previous errors
  
    // Validate the form
    if (this.loginForm.invalid) {
      this.error = 'Username and Password are not valid!';
      this.submitted = false; // Reset submitted flag to allow corrections
      return;
    }
  
    // Perform the login
    this.authService.login(this.f['userName'].value, this.f['password'].value).subscribe({
      next: (res) => {
        if (res?.token) {
          console.log('Login successful, navigating to dashboard');
          localStorage.removeItem("LoginFormError")
          this.router.navigate(['/dashboard/main']);
        } else {
          console.log('Login failed, no token received');
          this.error = 'Invalid login. Please try again.';
        }
      },
      error: (error) => {
        console.error('SigninComponent Login error:');
        localStorage.setItem("LoginFormError",error);
        this.error = "Login failed";
        this.submitted = false; // Allow form resubmission
       this.router.navigate(['/authentication/signin']);
      }
    });
  }
 

}

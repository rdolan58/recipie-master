import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '@core/models/user';
import { UserService } from '@core/service/user.service';
import { FeatherModule } from 'angular-feather';
import { ToastrModule, ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FeatherModule,
    RouterLink,
    ToastrModule,
  ],
})
export class SignupComponent implements OnInit {
  registerForm!: UntypedFormGroup;
  submitted = false;
  error = '';

  constructor(private formBuilder: UntypedFormBuilder, private userService: UserService, private toastr: ToastrService, private router: Router) { }

  addRecordSuccess() {
    //this.toastr.success('Add Record Successfully', '');
    this.router.navigate(['/authentication/signin']);
  }
  addRecordError() {
    this.toastr.success('Add Record Failed', '');
  }
  ngOnInit() {
    this.userService = this.userService;
    this.registerForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      uname: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      password: ['', Validators.required],
      termcondition: [false, [Validators.requiredTrue]],
    });
  }
  get f() {
    return this.registerForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.registerForm.invalid) {
      this.error = 'Invalid data !';
      return;
    } else {
      // register user call here..
      const newUser: User = {
        is_active: true,
        is_superuser: false,
        password: this.registerForm.value.password,
        is_staff: true, // Default value for new users
        first_name: this.registerForm.value.fname,
        username: this.registerForm.value.uname,
        last_name: this.registerForm.value.lname,
        email: this.registerForm.value.email,
      };


      this.userService.createUser(newUser).subscribe({
        next: (createdUser) => {
          // Add the created user to the local data array
          this.registerForm.reset();

          // Show success notification
          this.addRecordSuccess();
        },
        error: (error) => {
          console.error('Error adding user:', error);
        },
      });
    }

  }
}

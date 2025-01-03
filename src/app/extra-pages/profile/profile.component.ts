import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@core';
import { User } from '@core';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '@core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  selectedFile: File | undefined;
  previewUrl: string | null = null;
  userService: UserService;
  authService: AuthService;

  constructor(private fb: FormBuilder, userService: UserService, private router: Router, private location: Location, private cdr:ChangeDetectorRef, authService:AuthService ) {
    // Initialize the form with required fields
    this.authService = authService;
    this.userService = userService;
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      phone: [''],
      bio: [''],
      social_media_links: this.fb.group({
        linkedIn: [''],
        twitter: [''],
        facebook: [''],
      }),
      profile_image: [''],
    });
  }

  ngOnInit(): void {
    // Load the current user from localStorage
    const currentUserString = localStorage.getItem('currentUser');
    // this.currentUser = localStorage.getItem('currentUser');
    if (currentUserString) {
      this.currentUser = JSON.parse(currentUserString) as User;

      // Patch the form with the current user data
      this.profileForm.patchValue({
        ...this.currentUser,
        social_media_links: this.currentUser.social_media_links || {},
      });

      // Set the preview URL for the profile picture
      this.previewUrl = this.currentUser.profile_image_url || null;
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }


  onSubmit(): void {
    if (this.profileForm.valid) {
      // Prepare the patch data with only the necessary fields
      const patchData: Partial<User> = {
        id: this.currentUser?.id,
        username: this.profileForm.value.username,
        email: this.profileForm.value.email,
        first_name: this.profileForm.value.first_name,
        last_name: this.profileForm.value.last_name,
        phone: this.profileForm.value.phone,
        bio: this.profileForm.value.bio,
        social_media_links: this.profileForm.value.social_media_links,
      };

      // Debugging: Log the patch data
      console.log('Patch Data:', patchData);

      // Call the patchUser method from the service
      this.userService.patchUser(patchData, this.selectedFile).subscribe({
        next: (responseUser) => {
          // Use the returned user object from the server
          const updatedUser: User= responseUser;
      
          // Update localStorage with the returned user data
          this.currentUser = this.authService.updateCurrentUser(updatedUser);

          //this.currentUser = updatedUser;
          console.log('Profile updated successfully via PATCH:', this.currentUser);
          alert('Profile updated successfully!');
      
          // Trigger change detection to refresh the UI
          //this.cdr.detectChanges();

          // Navigate back after a slight delay (optional)
          this.onCancel();
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          alert('Error updating profile. Please try again.');
        },
      });

    } else {
      console.error('Form is invalid:', this.profileForm.errors);
      alert('Please fill out all required fields.');
    }
  }

  onCancel(): void {
    // Reset the form to its original state
    this.profileForm.reset();
    this.navigateBack();
    if (this.currentUser) {
      this.profileForm.patchValue(this.currentUser);
    }
    this.previewUrl = this.currentUser?.profile_image_url || null;
    this.selectedFile = undefined;
  }

  navigateBack(): void {

    if (this.location.path()) {
      this.location.back();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

}


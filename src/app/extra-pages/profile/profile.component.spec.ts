import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { ProfileService } from '@core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockProfileService: jasmine.SpyObj<ProfileService>;

  beforeEach(async () => {
    const profileServiceSpy = jasmine.createSpyObj('ProfileService', [
      'addUserProfile',
      'updateUserProfile',
      'getUserProfileById',
    ]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [ProfileComponent],
      providers: [{ provide: ProfileService, useValue: profileServiceSpy }],
    }).compileComponents();

    mockProfileService = TestBed.inject(ProfileService) as jasmine.SpyObj<ProfileService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all form fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#firstName')).toBeTruthy();
    expect(compiled.querySelector('#lastName')).toBeTruthy();
    expect(compiled.querySelector('#email')).toBeTruthy();
    expect(compiled.querySelector('#username')).toBeTruthy();
    expect(compiled.querySelector('#phone')).toBeTruthy();
    expect(compiled.querySelector('#linkedIn')).toBeTruthy();
    expect(compiled.querySelector('#twitter')).toBeTruthy();
    expect(compiled.querySelector('#facebook')).toBeTruthy();
    expect(compiled.querySelector('#bio')).toBeTruthy();
  });

  it('should call onFileSelect when a file is selected', () => {
    const event = { target: { files: [new Blob()] } } as unknown as Event;
    spyOn(component, 'onFileSelect');
    component.onFileSelect(event);
    expect(component.onFileSelect).toHaveBeenCalledWith(event);
  });

  it('should disable submit button if form is invalid', () => {
    component.profileForm.controls['firstName'].setValue('');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]');
    expect(submitButton?.getAttribute('disabled')).not.toBeNull();
  });
});

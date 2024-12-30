import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PasswordResetService } from './passwordreset.service';

describe('PasswordResetService', () => {
  let service: PasswordResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

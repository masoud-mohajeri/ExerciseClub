import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate: Date;
  spinner = false;
  subArray: Subscription[] = [];
  @ViewChild('myNgForm') myNgForm: NgForm;

  constructor(
    private authService: AuthService,
    private uiServiece: UIService,
    private router:Router
  ) {}

  ngOnInit() {
    this.subArray.push(
      this.uiServiece.needSpinner.subscribe((res) => {
        this.spinner = res;
      })
    );
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear - 18, 0, 1);
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    });
    this.myNgForm.resetForm();
  }

  ngOnDestroy() {
    this.subArray.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}

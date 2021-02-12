import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit,OnDestroy {
  loginForm: FormGroup;
  spinner = false;
  subArray: Subscription[] = [];
  @ViewChild('myNgForm') myNgForm: NgForm;

  constructor(private authService: AuthService, private uiService: UIService) {}

  ngOnInit(): void {
    this.subArray.push(
      this.uiService.needSpinner.subscribe((res) => {
        this.spinner = res;
      })
    );
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  onSubmit(): void {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });
    this.myNgForm.resetForm();
  }
  ngOnDestroy() {
    this.subArray.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}

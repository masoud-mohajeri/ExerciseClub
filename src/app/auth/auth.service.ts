import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { TrainingService } from '../training/training.service';
import { AuthDate } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;
  uid = new BehaviorSubject<string>(null);

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private ui: UIService
  ) {}
  registerUser(authData: AuthDate) {
    this.ui.needSpinner.next(true);
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.ui.needSpinner.next(false);
        this.router.navigate([''])
      })
      .catch((error) => {
        this.ui.needSpinner.next(false);
        this.ui.snakebar(error.message, 'Ok!');
      });
  }

  login(authData: AuthDate) {
    this.ui.needSpinner.next(true);
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.ui.needSpinner.next(false);
        this.router.navigate(['/']);
      })
      .catch((error) => {
        // console.log(error);
        this.ui.needSpinner.next(false);
        this.ui.snakebar(error.message, 'Ok!');
      });
  }
  logout() {
    this.afAuth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }

  isAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
      } else {
        this.trainingService.onLogout();
        this.isAuthenticated = false;
        this.authChange.next(false);
      }
    });
  }
}

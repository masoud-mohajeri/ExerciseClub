import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UIService {
  needSpinner = new BehaviorSubject<boolean>(false);
  darkTheme = new BehaviorSubject<boolean>(false);
  DTStat = false;
  constructor(private snackBar: MatSnackBar) {}

  snakebar(error, action) {
    this.snackBar.open(error, action, {
      duration: 4000,
    });
  }
  themeConfig() {
    this.DTStat = !this.DTStat;
    this.darkTheme.next(this.DTStat);
  }
}

import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { UIService } from './shared/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  themeChanger = false;
  constructor(private authServeice: AuthService, private ui: UIService) {}
  ngOnInit() {
    this.authServeice.isAuthListener();
    this.ui.darkTheme.subscribe((val) => {
      this.themeChanger = val;
    });
  }
}

import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidebareState = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription;
  themeStat;
  constructor(
    private authService: AuthService,
    private overlayContainer: OverlayContainer,
    private ui: UIService
  ) {
    // overlayContainer.getContainerElement().classList.add('unicorn-dark-theme');
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(
      (authStatus) => {
        this.isAuth = authStatus;
      }
    );
  }

  onToggleSidenav() {
    this.sidebareState.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  toggleTheme() {
    this.ui.themeConfig();
  }
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { CropTextPipe } from './crop-text.pipe';

@NgModule({
  declarations: [LoadingSpinnerComponent, CropTextPipe],
  imports: [CommonModule],
  exports: [LoadingSpinnerComponent, CropTextPipe],
})
export class SharedModule {}

import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { ArticleCardComponent } from './article-card/article-card.component';
import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './article.component';
import { NewArticleComponent } from './new-article/new-article.component';

@NgModule({
  declarations: [
    ArticleComponent,
    NewArticleComponent,
    ArticleCardComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    SharedModule,
    NgxMatFileInputModule,
    ArticleRoutingModule,
    ReactiveFormsModule
  ],
})
export class ArticleModule {}

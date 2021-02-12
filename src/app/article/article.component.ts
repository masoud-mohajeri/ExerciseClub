import { Component, OnInit, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Exercise } from '../training/exercise.model';
import { Article } from './article.model';
import { ArticlesService } from './articles.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent implements OnInit {
  @Output('exercies') exsImport;
  @Output('articles') artsImport;
  @Output() exerciseUrl;
  @Output() articleUrl;

  @Output() urls: string[] = [];
  @Output() theArticles: Article[] = [];

  @Output() urlsEx: string[] = [];
  @Output() theExercies: Exercise[] = [];

  constructor(
    private artService: ArticlesService,
    private afStorage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.getExercisesInfo();
    this.getArticlesInfo();
  }

  getExercisesInfo() {
    this.artService.getExs();
    this.artService.exercisesInfoEmmition.subscribe((exercise: Exercise[]) => {
      this.theExercies = exercise;
      for (const exs of exercise) {
        this.afStorage
          .ref('exImages' + '/' + exs.name)
          .getDownloadURL()
          .subscribe((url) => {
            this.urlsEx.push(url);
          });
      }
    });
  }

  getArticlesInfo() {
    this.artService.getArticles();
    this.artService.articlesInfoEmmition.subscribe((article: Article[]) => {
      this.theArticles = article;
      for (const arts of article) {
        this.afStorage
          .ref('artImages' + '/' + arts.name)
          .getDownloadURL()
          .subscribe((url) => {
            this.urls.push(url);
          });
      }
    });
  }
}

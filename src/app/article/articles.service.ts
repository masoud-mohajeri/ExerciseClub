import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subject } from 'rxjs';
import { Exercise } from '../training/exercise.model';
import { Article } from './article.model';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  exercisesInfoEmmition = new Subject<Exercise[]>();
  articlesInfoEmmition = new Subject<Article[]>();

  constructor(
    private afStorage: AngularFireStorage,
    private afs: AngularFirestore
  ) {}

  getExs() {
    this.afs
      .collection('availableExercises')
      .valueChanges()
      .subscribe((exercies: Exercise[]) => {
        this.exercisesInfoEmmition.next(exercies);
      });
  }

  getArticles() {
    this.afs
      .collection('articles')
      .valueChanges()
      .subscribe((articles: Article[]) => {
        this.articlesInfoEmmition.next(articles);
      });
  }

  getImage(directory: string, name: string) {
    const promise = new Promise((resolve, reject) => {
      this.afStorage
        .ref(directory + '/' + name)
        .getDownloadURL()
        .subscribe((url) => {
          resolve(url);
        });
    });
    return promise;
  }

  saveArticle(article: Article) {
    this.afs.collection('articles').add(article);
  }
}

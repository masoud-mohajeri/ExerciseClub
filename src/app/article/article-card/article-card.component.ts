import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exercise } from 'src/app/training/exercise.model';
import { Article } from '../article.model';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css'],
})
export class ArticleCardComponent implements OnInit {
  @Input() info: Exercise | Article;
  @Input() id: number;
  @Input() imgUrl: string;
  @Input() artcleType: string;
  @Input() imageUrl: string;
  textLength = 25;

  constructor(public router: Router, public route: ActivatedRoute) {}

  ngOnInit(): void {}
  onNavigate(path: string) {
    this.router.navigate([path]);
  }
  
  readMore() {
    if (this.textLength === 25) {
      this.textLength = this.info.description.length;
    } else {
      this.textLength = 25;
    }
  }
}

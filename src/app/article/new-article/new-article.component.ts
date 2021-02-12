import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MaxSizeValidator } from '@angular-material-components/file-input';
import { UIService } from 'src/app/shared/ui.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ArticlesService } from '../articles.service';
import { Article } from '../article.model';
@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.css'],
})
export class NewArticleComponent implements OnInit {
  articleForm: FormGroup;
  fileControl: FormControl;
  thieImage;
  uploadPercent: Observable<number>;
  uploadAbality = true;
  uploadFinished = false;
  @ViewChild('myNgForm') myNgForm: NgForm;

  constructor(
    private afStorage: AngularFireStorage,
    private ui: UIService,
    private articleService: ArticlesService
  ) {
    this.fileControl = new FormControl(this.thieImage, [
      Validators.required,
      MaxSizeValidator(1024 * 1024 * 3),
    ]);
  }

  ngOnInit(): void {
    this.articleForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      articleType: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(15),
      ]),
      articleImage: this.fileControl,
    });

    this.fileControl.valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files)) {
        this.thieImage = [files];
      } else {
        this.thieImage = files;
      }
    });
  }
  uploadFile(event) {
    let readyToUpload = false;
    if (!this.fileControl.errors?.maxSize) {
      readyToUpload = true;
    }

    if (readyToUpload) {
      const file = this.thieImage[0];
      const filePath = 'artImages/' + this.articleForm.value['name'];
      const ref = this.afStorage.ref(filePath);
      const task = ref.put(file);
      this.uploadPercent = task.percentageChanges();
      task.percentageChanges().subscribe((val) => {
        if (val === 100) {
          this.uploadAbality = false;
          this.uploadFinished = true;
        }
      });

      task.snapshotChanges().subscribe((val) => {
        if (val.state === 'success') {
          this.ui.snakebar('Upload Completed Successfully ', 'Ok!');
        }
      });
    } else {
      this.ui.snakebar(
        'Image is too big to upload ( Upload Limit : 3 MB) ! ',
        'Ok!'
      );
    }
  }

  onSubmit() {
    // console.log(this.articleForm);
    const article: Article = {
      name: this.articleForm.value.name,
      description: this.articleForm.value.description,
      articleType: this.articleForm.value.articleType,
    };
    this.articleService.saveArticle(article);
    // this.articleForm.reset();
    this.myNgForm.resetForm();
  }
}

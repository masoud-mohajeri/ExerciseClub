import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MaxSizeValidator } from '@angular-material-components/file-input';
import { AngularFireStorage } from '@angular/fire/storage';
import { UIService } from 'src/app/shared/ui.service';
import { Observable } from 'rxjs';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.css'],
})
export class CreateExerciseComponent implements OnInit {
  exerciseForm: FormGroup;
  thieImage = null;
  fileControl: FormControl;
  uploadPercent: Observable<number>;
  uploadAbality = true;
  uploadFinished = false;
  exsForCheck: Exercise[];
  @ViewChild('myNgForm') myNgForm: NgForm;
  constructor(
    private afStorage: AngularFireStorage,
    private ui: UIService,
    private trainingService: TrainingService
  ) {
    this.fileControl = new FormControl(this.thieImage, [
      Validators.required,
      MaxSizeValidator(1024 * 1024 * 3),
    ]);
  }

  ngOnInit(): void {
    this.exerciseForm = new FormGroup({
      name: new FormControl(
        null,
        [Validators.required],
        [this.checkExsNameUnique.bind(this)]
      ),
      duration: new FormControl(null, [Validators.required, Validators.min(1)]),
      calories: new FormControl(null, [Validators.required, Validators.min(1)]),
      // exImage: new FormControl(this.thieImage, MaxSizeValidator(16 * 1024)),
      exImage: this.fileControl,
      exDescription: new FormControl(null, [
        Validators.required,
        Validators.minLength(15),
      ]),
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
      const filePath = 'exImages/' + this.exerciseForm.value['name'];
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

  checkExsNameUnique(control: FormControl): Promise<any> | Observable<any> {
    return new Promise((resolve, reject) => {
      this.trainingService.fetchExercises();
      this.trainingService.availableExerciseEmit.subscribe(
        (exsArray: Exercise[]) => {
          if (exsArray.find(exs => exs.name === control.value)
          ) {
            resolve({ nameExists: true });
          }
        }
      );
    });
  }

  onSubmitEx() {
    // console.log(this.exerciseForm);
    const exs: Exercise = {
      name: this.exerciseForm.value.name,
      duration: this.exerciseForm.value.duration,
      calories: this.exerciseForm.value.calories,
      description: this.exerciseForm.value.exDescription,
    };
    this.trainingService.sendNewExsToServer(exs);
    this.myNgForm.resetForm();
  }
}

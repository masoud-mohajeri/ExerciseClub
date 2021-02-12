import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { error } from 'selenium-webdriver';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css'],
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  subArray: Subscription[] = [];
  @Input() theExercise;
  progress = 0;
  private timer;
  currentExercise: Exercise;
  trainingSubscribtion: Subscription;
  constructor(
    public dialog: MatDialog,
    private trainingService: TrainingService
  ) {}

  ngOnInit() {
    this.subArray.push(
      this.trainingService.runningExercise.subscribe((ex: Exercise) => {
        this.currentExercise = ex;
      })
    );

    // this.currentExercise = this.trainingService.runningExercise;
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    const step = this.currentExercise.duration * 10;
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      // if (this.progress === 100) {
      //   clearInterval(this.timer);
      //   this.trainingService.completesExercises();
      // }

      let promise = new Promise((resolve, reject) => {
        if (this.progress === 100) {
          resolve('done');
        }
      });
      promise.then((message) => {
        clearInterval(this.timer);
        this.trainingService.completesExercises();
      });
    }, step);
  }

  onStop() {
    clearInterval(this.timer);
    let dialogRef = this.dialog.open(StopTrainingComponent, {
      width: '250px',
      data: { progress: this.progress },
    });
    this.subArray.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.trainingService.cancelledExercises(this.progress);
        } else {
          this.startOrResumeTimer();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subArray.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}

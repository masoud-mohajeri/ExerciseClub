import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  subArray: Subscription[] = [];
  onGoingTraining = false;
  @Output() theExercise = null;
  exerciseSubscription: Subscription;
  constructor(
    private trainingService: TrainingService,
  ) {}

  ngOnInit(): void {
    this.subArray.push(
      ( this.trainingService.runningExercise.subscribe(
        (exercise) => {
          if (exercise) {
            this.onGoingTraining = true;
          } else {
            this.onGoingTraining = false;
          }
        }
      ))
    );
  }

  ngOnDestroy() {
    this.subArray.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}

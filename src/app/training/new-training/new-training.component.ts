import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output() trainingStart = new EventEmitter<void>();
  exercises: Exercise[];
  exerciseToDoId = null;
  exerciseSubscription: Subscription;
  spinner = false;
  constructor(
    private trainingService: TrainingService,
    private ui: UIService
  ) {}

  ngOnInit(): void {
    this.ui.needSpinner.subscribe((res) => {
      this.spinner = res;
    });
    this.fetchExercises();

    this.trainingService.fetchExercises();
  }

  fetchExercises() {
    this.exerciseSubscription = this.trainingService.availableExerciseEmit.subscribe(
      (exs) => {
        this.exercises = exs;
      }
    );
  }

  onStartTraining() {
    this.trainingService.startExercise(this.exerciseToDoId);
    this.trainingStart.emit();
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }
}

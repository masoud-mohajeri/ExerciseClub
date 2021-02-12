import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css'],
})
export class PastTrainingsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  subArray: Subscription[] = [];
  dataSource;
  dataSourceHolder: Exercise[];
  displayedColumns: string[] = ['name', 'calories', 'duration', 'state'];
  constructor(
    private trainingService: TrainingService,
    private ui: UIService
  ) {}
  spinner = false;
  ngOnInit(): void {
    this.subArray.push(
      this.ui.needSpinner.subscribe((res) => {
        this.spinner = res;
      })
    );
    this.dataSource = new MatTableDataSource();
    this.subArray.push(
      this.trainingService.doneExerciseEmit.subscribe((exs) => {
        this.dataSource.data = exs;
      })
    );

    this.trainingService.getDonExercises();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTotalDuration() {
    return Math.round(
      this.dataSource.data
        .map((t: Exercise) => t.duration)
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }
  getTotalCalories() {
    return Math.round(
      this.dataSource.data
        .map((t: Exercise) => t.calories)
        .reduce((acc: number, value: number) => acc + value, 0)
    );
  }
  ngOnDestroy() {
    this.subArray.forEach((sub) => {
      sub.unsubscribe();
    });
    this.dataSource = null;
  }
}

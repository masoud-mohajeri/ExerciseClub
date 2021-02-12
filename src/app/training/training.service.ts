import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Exercise } from './exercise.model';
import { map } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  runningExercise = new BehaviorSubject<Exercise>(null);
  onDoingExercise: Exercise;
  availableExercise: Exercise[];
  availableExerciseEmit = new Subject<Exercise[]>();
  doneExercise: Exercise[];
  doneExerciseEmit = new Subject<Exercise[]>();
  private subArray: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private ui: UIService,
    private afAuth: AngularFireAuth
  ) {}

  fetchExercises() {
    this.ui.needSpinner.next(true);
    this.subArray.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((resData) => {
            return resData.map((res) => {
              const data = res.payload.doc.data() as Exercise;
              return {
                id: res.payload.doc.id,
                name: data.name,
                calories: data.calories,
                duration: data.duration,
              };
            });
          })
        )
        .subscribe((exs: Exercise[]) => {
          this.ui.needSpinner.next(false);
          this.availableExercise = exs;
          this.availableExerciseEmit.next(this.availableExercise);
        })
    );
  }

  completesExercises() {

    this.afAuth.currentUser.then((user) => {
      this.sendDataToDatabase({
        ...this.onDoingExercise,
        date: new Date(),
        state: 'completed',
        uid: user.uid,
      });
      this.onDoingExercise = null;
      this.runningExercise.next(null);
    });

  }

  cancelledExercises(progress: number) {

    this.afAuth.currentUser.then((user) => {
      this.sendDataToDatabase({
        ...this.onDoingExercise,
        duration: (this.onDoingExercise.duration * progress) / 100,
        calories: (this.onDoingExercise.calories * progress) / 100,
        date: new Date(),
        state: 'cancelled',
        uid: user.uid,
      });
      this.onDoingExercise = null;
      this.runningExercise.next(null);
    });
  }

  startExercise(exId: string) {
    this.onDoingExercise = this.availableExercise.find((ex) => ex.id === exId);

    const exCopy: Exercise = { ...this.onDoingExercise };
    this.runningExercise.next(exCopy);
  }
  getRunningExercise() {
    return { ...this.onDoingExercise };
  }
  sendDataToDatabase(exs: Exercise) {
    this.db.collection('finishedExercises').add(exs);
  }
  getDonExercises() {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        let theuid = user.uid;
        this.subArray.push(
          this.db
            .collection('finishedExercises', (ref) =>
              ref.where('uid', '==', theuid)
            )
            .valueChanges()
            .subscribe((exs: Exercise[]) => {
              this.doneExerciseEmit.next(exs);
              this.ui.needSpinner.next(false);
            })
        );
      } else {
        this.ui.snakebar('Couldnt get Exercies','Ok!')
      }
    });
  }

  onLogout() {
    this.doneExerciseEmit.next(null);
    this.doneExercise = null;
    this.subArray.forEach((sub) => sub.unsubscribe());
  }

  sendNewExsToServer(exs: Exercise) {
    this.db.collection('availableExercises').add(exs);
  }
}

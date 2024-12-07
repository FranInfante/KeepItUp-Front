import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Workout } from '../../shared/interfaces/workout';
import { WorkoutsService } from '../../shared/service/workouts.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/service/user.service';
import { SubscriptionLike } from 'rxjs';
import { User } from '../../shared/interfaces/users';
import { BackToMenuComponent } from '../../shared/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [BackToMenuComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.css',
})
export class WorkoutsComponent implements OnInit {

  workoutForm!: FormGroup;
  workoutLogs: Workout[] = [];
  totalWorkouts: number = 0;
  showForm: boolean = false;
  subscriptions: SubscriptionLike[] = [];
  userId: number = 0;
  user: User | null = null;
  workoutToDeleteId?: number;
  showDeleteModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private workoutService: WorkoutsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.subscriptions.push(
      this.userService.getCurrentUser().subscribe((user) => {
        if (user && user.id) {
          this.userId = user.id;
          this.loadWorkouts();
        }
      })
    );
  }

  initializeForm(): void {
    this.workoutForm = this.fb.group({
      name: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0]],
    });
  }

  logWorkout(): void {
    if (this.workoutForm.valid) {
      const newWorkout: Workout = this.workoutForm.value;
      this.workoutService.addWorkout(newWorkout).subscribe((workout) => {
        this.workoutLogs.push(workout);
        this.totalWorkouts++;
        this.toggleForm();
        this.workoutForm.reset({
          name: '',
          date: new Date().toISOString().split('T')[0],
        });
      });
    }
  }

  loadWorkouts(): void {
    this.workoutService.getWorkouts(this.userId).subscribe((workouts) => {
      this.workoutLogs = workouts;
      this.totalWorkouts = workouts.length;
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  
  showDeleteConfirmation(workoutId: number): void {
    this.workoutToDeleteId = workoutId;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.workoutToDeleteId = undefined;
  }

  confirmDelete(): void {
    if (!this.workoutToDeleteId) {
      return;
    }

    this.workoutService.deleteWorkout(this.workoutToDeleteId).subscribe(() => {
      this.workoutLogs = this.workoutLogs.filter(
        (workout) => workout.id !== this.workoutToDeleteId
      );
      this.totalWorkouts--;
      this.cancelDelete();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { BackToMenuComponent } from '../../shared/components/back-to-menu/back-to-menu.component';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WeighIn } from '../../shared/interfaces/weighin';
import { WeighInsService } from '../../shared/service/weighins.service';
import { User } from '../../shared/interfaces/users';
import { SubscriptionLike } from 'rxjs';
import { UserService } from '../../shared/service/user.service';

@Component({
  selector: 'app-weighins',
  standalone: true,
  imports: [BackToMenuComponent, CommonModule, ReactiveFormsModule ],
  templateUrl: './weighins.component.html',
  styleUrl: './weighins.component.css'
})
export class WeighInsComponent implements OnInit {
  weightForm!: FormGroup;
  previousLogs: WeighIn[] = [];
  totalWeightChange: string = '0.0 kg';
  userId: number = 0;
  user: User | null = null;
  subscriptions: SubscriptionLike[] = [];

  constructor(
    private fb: FormBuilder,
    private weighInsService: WeighInsService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.subscriptions.push(
      this.userService.getCurrentUser().subscribe(user => {
        if (user && user.id) {
          this.userId = user.id;
          this.loadLogs();
        }
      })
    );
  }

  initializeForm(): void {
    this.weightForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(1)]],
      date: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
    });
  }

  logWeight(): void {
    if (this.weightForm.valid) {
      const newLog: WeighIn = {
        ...this.weightForm.value,
        userId: this.userId, // Add userId to the payload
      };

      this.weighInsService.addWeighIn(newLog).subscribe({
        next: (loggedWeighIn) => {
          this.previousLogs.push(loggedWeighIn);
          this.calculateWeightChange();
          this.weightForm.reset({
            weight: '',
            date: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
          });
        },
        error: (error) => {
          console.error('Error logging weight:', error);
        },
      });
    }
  }

  loadLogs(): void {
    this.weighInsService.getWeighIns(this.userId).subscribe({
      next: (logs) => {
        this.previousLogs = logs;
        this.calculateWeightChange();
      },
      error: (error) => {
        console.error('Error fetching logs:', error);
      },
    });
  }

  calculateWeightChange(): void {
    if (this.previousLogs.length > 1) {
      const initialWeight = this.previousLogs[0].weight;
      const latestWeight = this.previousLogs[this.previousLogs.length - 1].weight;
      const change = latestWeight - initialWeight;
      this.totalWeightChange = `${change > 0 ? '+' : ''}${change.toFixed(1)} kg`;
    } else {
      this.totalWeightChange = '0.0 kg';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { HealthWellnessService } from '../../services/health-wellness-service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-health-wellness',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './health-wellness.html',
  styleUrl: './health-wellness.css',
})
export class HealthWellness implements OnInit {

  studentId!: number;

  wellnessList: any[] = [];

  isCreating: boolean = false;
  isEditing: boolean = false;
  editingId: number | null = null;

  form: any = {
    mood: '',
    stressLevel: 5,
    sleepHours: 0,
    energyLevel: '',
    productivity: 5,
    notes: '',
    dateLogged: '',
    student: { id: 0 }
  };

  constructor(
    private wellnessService: HealthWellnessService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.studentId = this.authService.getStudentId();
    this.loadWellnessList();
  }

  // LOAD ALL ENTRIES
  loadWellnessList() {
    this.wellnessService.getByStudent(this.studentId).subscribe({
      next: (entries) => {
        this.wellnessList = entries;
        this.cdr.detectChanges();
      },
      error: () => {
        this.wellnessList = [];
        this.cdr.detectChanges();
      }
    });
  }

  // START CREATE MODE
  startCreate() {
    this.isCreating = true;
    this.isEditing = false;
    this.editingId = null;

    this.form = {
      mood: '',
      stressLevel: 5,
      sleepHours: 0,
      energyLevel: '',
      productivity: 5,
      notes: '',
      dateLogged: new Date().toISOString().substring(0, 10),
      student: { id: this.studentId }
    };
  }

  // CREATE ENTRY
  createEntry() {
    this.wellnessService.create(this.form).subscribe(() => {
      this.isCreating = false;
      this.loadWellnessList();
      this.cdr.detectChanges();
    });
  }

  // START EDIT MODE
  editEntry(entry: any) {
    this.isEditing = true;
    this.isCreating = false;
    this.editingId = entry.id;

    this.form = { ...entry };
  }

  // UPDATE ENTRY
  updateEntry() {
    if (!this.editingId) return;

    this.wellnessService.update(this.editingId, this.form).subscribe(() => {
      this.isEditing = false;
      this.editingId = null;
      this.loadWellnessList();
      this.cdr.detectChanges();
    });
  }

  // DELETE ENTRY
  deleteEntry(id: number) {
    this.wellnessService.delete(id).subscribe(() => {
      if (this.editingId === id) {
        this.isEditing = false;
        this.editingId = null;
      }
      this.loadWellnessList();
      this.cdr.detectChanges();
    });
  }

  // CANCEL CREATE/EDIT
  cancel() {
    this.isCreating = false;
    this.isEditing = false;
    this.editingId = null;
  }

  // EMOJI HELPER
  getMoodEmoji(mood: string): string {
    switch (mood) {
      case 'Happy': return '😄';
      case 'Okay': return '🙂';
      case 'Neutral': return '😐';
      case 'Sad': return '😞';
      case 'Stressed': return '😡';
      default: return '🙂';
    }
  }
}

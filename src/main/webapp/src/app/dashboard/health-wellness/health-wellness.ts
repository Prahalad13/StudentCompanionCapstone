import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { HealthWellnessService } from '../../services/health-wellness-service';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-health-wellness',
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, MatCardModule],
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

  // alert box (cancel and delete button)

  confirmDeleteId: number | null = null;
  

openDeleteConfirm(id: number) {
  this.confirmDeleteId = id;
}

closeDeleteConfirm() {
  this.confirmDeleteId = null;
}

confirmDelete() {
  if (!this.confirmDeleteId) return;

  this.wellnessService.delete(this.confirmDeleteId).subscribe(() => {
    this.confirmDeleteId = null;
    this.loadWellnessList();
  });
}

  constructor(
    private wellnessService: HealthWellnessService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
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

  // no create function since we're not creating in the same component

  editEntry(id: number) {
  this.router.navigate(
    ['dashboard/health-wellness/create-health-wellness'],
    { queryParams: { id } }
  );
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

//   getMoodEmojiStatic(mood: string): string {
//   const emojiMap: any = {
//     Happy: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.webp",
//     Okay: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/512.webp",
//     Neutral: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.webp",
//     Sad: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.webp",
//     Stressed: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f620/512.webp",
//     Tired: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f62a/512.webp"
//   };

//   return emojiMap[mood] || emojiMap["Okay"];
// }

  getMoodEmoji(mood: string): string {
  const emojiMap: any = {
    Happy: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.gif",
    Okay: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/512.gif",
    Neutral: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.gif",
    Sad: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif",
    Stressed: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f620/512.gif",
    Tired: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f62a/512.gif"
  };

  return emojiMap[mood] || emojiMap["Okay"];
}

}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { HealthWellnessService } from '../../services/health-wellness-service';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

// alerts
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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

    // Close the popup
    this.confirmDeleteId = null;

    // ⭐ SUCCESS SNACKBAR
    this.snackBar.open("Wellness entry deleted.", "Close", {
      duration: 3000,
      verticalPosition: "top",
      panelClass: ['custom-snackbar']
    });

    // Reload list
    this.loadWellnessList();
  });
}


  constructor(
    private wellnessService: HealthWellnessService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    this.studentId = this.authService.getStudentId();
    this.loadWellnessList();

    const navState = history.state;

  if (navState?.wellnessMessage === "created") {
    this.snackBar.open("Wellness entry created successfully!", "Close", {
      duration: 3000,
      verticalPosition: "top",
      panelClass: ['custom-snackbar']
    });
  }

  if (navState?.wellnessMessage === "updated") {
    this.snackBar.open("Wellness entry updated successfully!", "Close", {
      duration: 3000,
      verticalPosition: "top",
      panelClass: ['custom-snackbar']
    });
  }
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

      this.snackBar.open("Wellness entry deleted.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });


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

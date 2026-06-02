import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HealthWellnessService } from '../../../services/health-wellness-service';
import { AuthService } from '../../../services/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

// date imports
import {ChangeDetectionStrategy} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-create-health-wellness',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatSliderModule, MatFormFieldModule, MatInputModule, MatDatepickerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-health-wellness.html',
  styleUrl: './create-health-wellness.css',
})
export class CreateHealthWellness implements OnInit {

  studentId!: number;
  isEditing = false;

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

  selectedEmojiWebp: string = "";
  selectedEmojiGif: string = "";

  // ⭐ SINGLE emojiMap used everywhere
  emojiMap: any = {
    Happy: {
      webp: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.webp",
      gif:  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.gif"
    },
    Okay: {
      webp: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/512.webp",
      gif:  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/512.gif"
    },
    Neutral: {
      webp: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.webp",
      gif:  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.gif"
    },
    Sad: {
      webp: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.webp",
      gif:  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif"
    },
    Stressed: {
      webp: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f620/512.webp",
      gif:  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f620/512.gif"
    },
    Tired: {
      webp: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f62a/512.webp",
      gif:  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f62a/512.gif"
    }
  };

  constructor(
    private wellnessService: HealthWellnessService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.studentId = this.authService.getStudentId();

    this.activatedRoute.queryParams.subscribe(params => {
      const id = params['id'];

      if (id) {
        // ⭐ EDIT MODE
        this.isEditing = true;
        this.loadEntry(Number(id));

        this.cdr.detectChanges();
      } else {
        // ⭐ CREATE MODE
        this.isEditing = false;

        this.form.student.id = this.studentId;
        this.form.dateLogged = new Date().toISOString().substring(0, 10);

        // Default mood + emoji
        this.form.mood = "Okay";
        this.selectedEmojiWebp = this.emojiMap["Okay"].webp;
        this.selectedEmojiGif  = this.emojiMap["Okay"].gif;

        this.cdr.detectChanges(); // ⭐ force Angular to update the DOM

        setTimeout(() => {
          this.form.stressLevel = 5;
        });
      }
    });
  }

  // ⭐ Mood selection uses the class emojiMap
  selectMood(mood: string) {
    this.form.mood = mood;

    this.selectedEmojiWebp = this.emojiMap[mood].webp;
    this.selectedEmojiGif  = this.emojiMap[mood].gif;

    const emojiEl = document.querySelector('.big-emoji') as HTMLElement | null;
    if (emojiEl) {
      emojiEl.classList.remove('animate');
      void emojiEl.offsetWidth;
      emojiEl.classList.add('animate');
    }
  }

  createEntry() {
    if (!this.form.mood || this.form.energyLevel === '' || this.form.sleepHours === null) {
      alert("Please complete all required fields.");
      return;
    }

    this.form.energyLevel = Number(this.form.energyLevel);

    if (!this.form.notes || this.form.notes.trim() === "") {
      this.form.notes = "No notes added.";
    }

    if (this.form.dateLogged instanceof Date) {
      this.form.dateLogged = this.form.dateLogged.toISOString().substring(0, 10);
    }

    this.wellnessService.create(this.form).subscribe(() => {
      this.router.navigate(['/dashboard/health-wellness']);
    });
  }

  // ⭐ Edit mode loads the entry + emoji correctly
  loadEntry(id: number) {
    this.wellnessService.getById(id).subscribe((entry: any) => {
      this.form = {
        ...entry,
        dateLogged: entry.dateLogged.substring(0, 10)
      };

      this.selectedEmojiWebp = this.emojiMap[entry.mood].webp;
      this.selectedEmojiGif  = this.emojiMap[entry.mood].gif;

      this.cdr.detectChanges();
    });
  }
}

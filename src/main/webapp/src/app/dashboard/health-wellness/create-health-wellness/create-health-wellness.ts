import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HealthWellnessService } from '../../../services/health-wellness-service';
import { AuthService } from '../../../services/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

// date imports
import {ChangeDetectionStrategy} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-create-health-wellness',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, FormsModule, RouterModule, MatSliderModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-health-wellness.html',
  styleUrl: './create-health-wellness.css',
})
export class CreateHealthWellness {

  studentId!: number;

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

selectMood(mood: string) {
  this.form.mood = mood;

  const emojiMap : any =  {
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

this.selectedEmojiWebp = emojiMap[mood].webp;
    this.selectedEmojiGif = emojiMap[mood].gif;


  // Trigger animation
const emojiEl = document.querySelector('.big-emoji') as HTMLElement | null;  if (emojiEl) {
    emojiEl.classList.remove('animate');
    void emojiEl.offsetWidth; // forces reflow
    emojiEl.classList.add('animate');
  }

}


  constructor(
    private wellnessService: HealthWellnessService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentId = this.authService.getStudentId();
    this.form.student.id = this.studentId;
    this.form.dateLogged = new Date().toISOString().substring(0, 10);

     // Default mood
  this.form.mood = "Okay";

  // Default animated emoji
  this.selectedEmojiWebp = "https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/512.webp";
  this.selectedEmojiGif  = "https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/512.gif";
  
    setTimeout(() => {
  this.form.stressLevel = 5;
});
}

  createEntry() {
    this.wellnessService.create(this.form).subscribe(() => {
      this.router.navigate(['/dashboard/health-wellness']);
    });
  }
}

import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatService } from '../../services/chat-service';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {

  @ViewChild('messageList') messageListRef!: ElementRef;

  messages: ChatMessage[] = [];
  inputText = '';
  loading = false;
  studentId!: number;
  studentName = '';

  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.studentId = Number(localStorage.getItem('studentId'));
    const studentJson = localStorage.getItem('student');
    if (studentJson) {
      const student = JSON.parse(studentJson);
      this.studentName = student?.name || 'Student';
    }

    this.messages.push({
      role: 'ai',
      text: `Hi ${this.studentName}! I'm your AI academic assistant. I already know about your courses and upcoming assessments. How can I help you today?`,
      timestamp: new Date()
    });
  }

  sendMessage() {
    const text = this.inputText.trim();
    if (!text || this.loading) return;

    this.messages.push({ role: 'user', text, timestamp: new Date() });
    this.inputText = '';
    this.loading = true;
    this.scrollToBottom();

    this.chatService.sendMessage(this.studentId, text).subscribe({
      next: (res) => {
        this.messages.push({ role: 'ai', text: res.reply, timestamp: new Date() });
        this.loading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Chat error:', err);
        this.messages.push({
          role: 'ai',
          text: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        });
        this.loading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      }
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messageListRef) {
        this.messageListRef.nativeElement.scrollTop =
          this.messageListRef.nativeElement.scrollHeight;
      }
    }, 50);
  }
}
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SummarizerService } from '../../services/summarizer-service';

@Component({
  selector: 'app-summarizer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './summarizer.html',
  styleUrl: './summarizer.css',
})
export class Summarizer {

  isDragging   = false;
  selectedFile: File | null = null;
  loading      = false;
  summary: string | null = null;
  fileName: string | null = null;
  error: string | null = null;
  copied       = false;

  readonly ALLOWED_EXT = ['.pdf', '.docx', '.txt'];

  constructor(
    private summarizerService: SummarizerService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  // ── DRAG & DROP ────────────────────────────────────────────────────────────

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.handleFile(input.files[0]);
    // Reset input so the same file can be re-selected after a reset
    input.value = '';
  }

  // ── FILE HANDLING ──────────────────────────────────────────────────────────

  handleFile(file: File) {
    const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
    if (!this.ALLOWED_EXT.includes(ext)) {
      this.error = `Unsupported file type "${ext}". Please upload a PDF, DOCX, or TXT file.`;
      this.cdr.detectChanges();
      return;
    }
    this.selectedFile = file;
    this.summary      = null;
    this.error        = null;
    this.cdr.detectChanges();
  }

  // ── SUMMARIZE ──────────────────────────────────────────────────────────────

  summarize() {
    if (!this.selectedFile || this.loading) return;

    this.loading = true;
    this.error   = null;
    this.summary = null;
    this.cdr.detectChanges();

    this.summarizerService.summarize(this.selectedFile).subscribe({
      next: (res) => {
        this.summary  = res.summary;
        this.fileName = res.fileName;
        this.loading  = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Summarizer error:', err);
        this.error   = 'Failed to summarize the file. Please check your connection and try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── RESET ──────────────────────────────────────────────────────────────────

  reset() {
    this.selectedFile = null;
    this.summary      = null;
    this.fileName     = null;
    this.error        = null;
    this.loading      = false;
    this.copied       = false;
    this.cdr.detectChanges();
  }

  // ── COPY TO CLIPBOARD ──────────────────────────────────────────────────────

  copyToClipboard() {
    if (!this.summary) return;
    navigator.clipboard.writeText(this.summary).then(() => {
      this.copied = true;
      this.cdr.detectChanges();
      setTimeout(() => { this.copied = false; this.cdr.detectChanges(); }, 2000);
    });
  }

  // ── HELPERS ────────────────────────────────────────────────────────────────

  getFileIcon(name: string): string {
    if (name.endsWith('.pdf'))  return '📕';
    if (name.endsWith('.docx')) return '📘';
    return '📄';
  }

  getFileSize(bytes: number): string {
    if (bytes < 1024)            return bytes + ' B';
    if (bytes < 1024 * 1024)     return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * Converts the Groq markdown response into safe HTML so it renders nicely
   * (## headings, **bold**, - bullet points).
   */
  formatSummary(text: string): SafeHtml {
    const lines = text.split('\n');
    let html    = '';
    let inList  = false;

    for (const raw of lines) {
      const line = raw.trim();

      if (line.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h3>${this.escapeThenBold(line.substring(3))}</h3>`;

      } else if (line.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h4>${this.escapeThenBold(line.substring(4))}</h4>`;

      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${this.escapeThenBold(line.substring(2))}</li>`;

      } else if (line === '') {
        if (inList) { html += '</ul>'; inList = false; }

      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p>${this.escapeThenBold(line)}</p>`;
      }
    }

    if (inList) html += '</ul>';

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private escapeThenBold(text: string): string {
    // Escape HTML special chars first, then apply **bold**
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
}
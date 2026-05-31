import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-modal.html',
  styleUrl: './feedback-modal.css'
})
export class FeedbackModal {
  // هادو باش نتحكمو فالـ Modal من برا
  @Input() isOpen: boolean = false;
  @Input() eventTitle: string = 'cet événement';
  @Output() close = new EventEmitter<void>();

  rating: number = 0;
  hoveredRating: number = 0;
  comment: string = '';
  stars: number[] = [1, 2, 3, 4, 5];

  // باش نحددو شحال من نجمة كليكا عليها
  setRating(val: number): void {
    this.rating = val;
  }

  // دالة إرسال التقييم
  soumettreFeedback(): void {
    if (this.rating === 0) {
      alert('Veuillez donner une note (étoiles) avant de soumettre.');
      return;
    }
    
    console.log('Feedback soumis avec succès :', {
      event: this.eventTitle,
      rating: this.rating,
      comment: this.comment
    });
    
    alert('Merci pour votre feedback !');
    this.closeModal();
  }

  // دالة سدان الـ Modal وتصفير الخانات
  closeModal(): void {
    this.rating = 0;
    this.comment = '';
    this.close.emit();
  }
}
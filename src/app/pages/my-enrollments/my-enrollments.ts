import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackModal } from '../../components/feedback-modal/feedback-modal';

interface Inscription {
  id: number;
  eventTitle: string;
  date: string;
  location: string;
  statutInscription: 'CONFIRMEE' | 'EN_ATTENTE' | 'ANNULEE';
}

@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  imports: [CommonModule, FeedbackModal], 
  templateUrl: './my-enrollments.html',
  styleUrl: './my-enrollments.css'
})
export class MyEnrollments {
  
  showModal: boolean = false; 
  selectedEventTitle: string = '';

  // هاهو الطابلو اللي كان ناقص وكيقلب عليه الـ HTML
  mesFeedbacks: any[] = []; 

  inscriptions: Inscription[] = [
    { id: 101, eventTitle: 'Angular Masterclass: De Zéro à Héros', date: '15 Nov 2024', location: 'Amphi A, ENSET', statutInscription: 'CONFIRMEE' },
    { id: 102, eventTitle: 'AI & Future Tech Conference', date: '20 Nov 2024', location: 'Salle de Conférence', statutInscription: 'EN_ATTENTE' },
    { id: 103, eventTitle: 'ENSET CodeFest Hackathon', date: '01 Dec 2024', location: 'Bloc Informatique', statutInscription: 'CONFIRMEE' }
  ];

  ouvrirFeedback(title: string): void {
    this.selectedEventTitle = title;
    this.showModal = true;
  }

  // هاهي الدالة اللي كانت ناقصة وكيقلب عليها الـ HTML
  recevoirFeedback(nouveauFeedback: any): void {
    this.mesFeedbacks.push(nouveauFeedback);
    this.showModal = false;
  }

  annulerInscription(id: number): void {
    const confirmation = confirm('Êtes-vous sûr de vouloir annuler votre inscription à cet événement ?');
    
    if (confirmation) {
      this.inscriptions = this.inscriptions.map(ins => {
        if (ins.id === id) {
          return { ...ins, statutInscription: 'ANNULEE' };
        }
        return ins;
      });
      alert('Votre inscription a été annulée avec succès.');
    }
  }
}
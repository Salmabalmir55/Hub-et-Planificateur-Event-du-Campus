import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink], // RouterLink باش نقدر نرجع لـ Catalog
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css'
})
export class EventDetail implements OnInit {
  eventId: string | null = null;
  
  // بيانات وهمية للحدث (فالواقع غاتجيبها من الـ Backend بالاعتماد على eventId)
  event: any = {
    id: 1,
    title: 'Angular Masterclass: De Zéro à Héros',
    description: 'Rejoignez-nous pour une journée intensive dédiée à l\'apprentissage d\'Angular. Nous couvrirons les bases, le routage, les requêtes HTTP, et les bonnes pratiques pour créer des applications web modernes et performantes. Cet événement est idéal pour les étudiants de l\'ENSET souhaitant booster leurs compétences en développement front-end.',
    date: '15 Novembre 2024',
    time: '09:00 - 17:00',
    location: 'Amphi A, ENSET Mohammedia',
    imageUrl: 'assets/angular.jpg', 
    placesRestantes: 24,
    price: 'Gratuit',
    organizer: 'Club Informatique ENSET'
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // كنجبدو الـ id من الـ URL
    this.eventId = this.route.snapshot.paramMap.get('id');
    console.log('Affichage des détails pour l\'événement ID:', this.eventId);
  }

  // دالة التسجيل فالحدث
  sinscrireEvenement(): void {
    if (this.event.placesRestantes > 0) {
      alert('Inscription réussie ! Vous êtes maintenant inscrit à cet événement.');
      this.event.placesRestantes--; // كنقصو بلاصة وحدة
    } else {
      alert('Désolé, il n\'y a plus de places disponibles pour cet événement.');
    }
  }
}
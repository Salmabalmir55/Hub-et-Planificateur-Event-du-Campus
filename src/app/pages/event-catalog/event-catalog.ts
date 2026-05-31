import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface EventItem {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
  price: string;
}

@Component({
  selector: 'app-event-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // ضروريين باش يخدم لينا ngFor و ngModel
  templateUrl: './event-catalog.html',
  styleUrl: './event-catalog.css'
})
export class EventCatalog {
  
  searchTerm: string = '';
  selectedCategory: string = 'All';
  categories: string[] = ['All', 'Workshop', 'Conference', 'Hackathon', 'Sport'];

  // بيانات وهمية باش نستيستيو الديزاين
  events: EventItem[] = [
    { id: 1, title: 'Angular Masterclass', date: '15 Nov 2024', category: 'Workshop', image: 'assets/angular.jpg', price: 'Free' },
    { id: 2, title: 'AI & Future Tech', date: '20 Nov 2024', category: 'Conference', image: 'assets/ai.jpg', price: '50 MAD' },
    { id: 3, title: 'ENSET CodeFest', date: '01 Dec 2024', category: 'Hackathon', image: 'assets/hackathon.jpg', price: 'Free' },
    { id: 4, title: 'Campus Football Cup', date: '10 Dec 2024', category: 'Sport', image: 'assets/sport.jpg', price: '20 MAD' },
    { id: 5, title: 'React vs Vue Debate', date: '12 Dec 2024', category: 'Conference', image: 'assets/react.jpg', price: 'Free' }
  ];

  filteredEvents: EventItem[] = this.events;

  // دالة الفلترة والبحث
  filterEvents() {
    this.filteredEvents = this.events.filter(event => {
      const matchCategory = this.selectedCategory === 'All' || event.category === this.selectedCategory;
      const matchSearch = event.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }

  setCategory(cat: string) {
    this.selectedCategory = cat;
    this.filterEvents();
  }
}
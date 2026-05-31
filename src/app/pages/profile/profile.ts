import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  modifierProfil(): void {
    alert('Your profile has been modified successfully!');
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected picture:', file.name);
    }
  }
}
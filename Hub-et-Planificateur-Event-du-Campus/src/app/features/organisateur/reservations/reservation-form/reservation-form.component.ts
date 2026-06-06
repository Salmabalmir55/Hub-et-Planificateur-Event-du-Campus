import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalleService, Salle } from '../../../../core/services/salle.service';
import { ReservationService } from '../../../../core/services/reservation.service';  // ✅ Chemin corrigé

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  reservationForm!: FormGroup;
  loading: boolean = false;
  error: string = '';
  isEditMode: boolean = false;
  reservationId: number | null = null;
  salles: Salle[] = [];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private salleService = inject(SalleService);
  private reservationService = inject(ReservationService);  // ✅ Maintenant correct

  ngOnInit(): void {
    this.initForm();
    this.loadSalles();
    this.checkEditMode();
  }

  initForm(): void {
    this.reservationForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      salleId: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      description: ['', Validators.maxLength(500)],
      nombreParticipants: [1, [Validators.required, Validators.min(1)]],
      equipements: [''],
      notes: ['']
    });
  }

  loadSalles(): void {
    this.salleService.getAll().subscribe({
      next: (data) => {
        this.salles = data;
      },
      error: (err) => {
        console.error('Erreur chargement salles:', err);
        this.error = 'Erreur lors du chargement des salles';
      }
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.reservationId = parseInt(id);
      this.loadReservationData();
    }
  }

  loadReservationData(): void {
    this.loading = true;
    this.reservationService.getById(this.reservationId!).subscribe({
      next: (data) => {
        this.reservationForm.patchValue({
          titre: data.titre,
          salleId: data.salleId,
          dateDebut: this.formatDateTimeForInput(data.dateDebut),
          dateFin: this.formatDateTimeForInput(data.dateFin),
          description: data.description,
          nombreParticipants: data.nombreParticipants,
          equipements: data.equipements?.join(', ') || '',
          notes: data.notes
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement réservation:', err);
        this.error = 'Erreur lors du chargement de la réservation';
        this.loading = false;
      }
    });
  }

  formatDateTimeForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  onSubmit(): void {
    if (this.reservationForm.invalid) {
      Object.keys(this.reservationForm.controls).forEach(key => {
        this.reservationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = '';

    const formValue = this.reservationForm.value;
    const reservationData = {
      ...formValue,
      equipements: formValue.equipements ? formValue.equipements.split(',').map((e: string) => e.trim()) : []
    };

    const request = this.isEditMode
      ? this.reservationService.update(this.reservationId!, reservationData)
      : this.reservationService.create(reservationData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/organisateur/reservations']);
      },
      error: (err) => {
        console.error('Erreur soumission:', err);
        this.error = 'Erreur lors de l\'enregistrement de la réservation';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/organisateur/reservations']);
  }

  get f() {
    return this.reservationForm.controls;
  }
}

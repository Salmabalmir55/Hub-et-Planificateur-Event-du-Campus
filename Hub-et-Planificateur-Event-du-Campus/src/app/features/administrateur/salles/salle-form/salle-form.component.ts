import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalleService } from '../../../../core/services/salle.service';

@Component({
  selector: 'app-salle-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './salle-form.component.html',
  styleUrls: ['./salle-form.component.css']
})
export class SalleFormComponent implements OnInit {
  salleForm!: FormGroup;
  loading: boolean = false;
  error: string = '';
  isEditMode: boolean = false;
  salleId: number | null = null;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private salleService = inject(SalleService);

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.salleForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      capacite: ['', [Validators.required, Validators.min(1)]],
      localisation: ['', Validators.required],
      equipements: [''],
      type: ['']
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.salleId = parseInt(id);
      this.loadSalleData();
    }
  }

  // ✅ Chargement depuis la vraie API
  loadSalleData(): void {
    this.loading = true;
    this.salleService.getById(this.salleId!).subscribe({
      next: (data) => {
        this.salleForm.patchValue({
          nom: data.nom,
          capacite: data.capacite,
          localisation: data.localisation,
          equipements: data.equipements,
          type: data.type || ''
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement:', err);
        this.error = 'Erreur lors du chargement de la salle';
        this.loading = false;
      }
    });
  }

  // ✅ Sauvegarde vers la vraie API
  onSubmit(): void {
    if (this.salleForm.invalid) {
      Object.keys(this.salleForm.controls).forEach(key => {
        this.salleForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = '';

    const formValue = this.salleForm.value;

    const request = this.isEditMode
      ? this.salleService.update(this.salleId!, formValue)
      : this.salleService.create(formValue);

    request.subscribe({
      next: (response) => {
        console.log('Salle sauvegardée:', response);
        this.loading = false;
        // ✅ Redirection vers la liste après sauvegarde
        this.router.navigate(['/administrateur/salles']);
      },
      error: (err) => {
        console.error('Erreur sauvegarde:', err);
        this.error = 'Erreur lors de l\'enregistrement de la salle';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/administrateur/salles']);
  }

  get f() {
    return this.salleForm.controls;
  }
}

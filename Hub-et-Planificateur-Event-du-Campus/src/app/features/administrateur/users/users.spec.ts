import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial filter set to "Tous"', () => {
    expect(component.activeFilter).toBe('Tous');
  });

  it('should change filter when setFilter is called', () => {
    component.setFilter('Organisateurs');
    expect(component.activeFilter).toBe('Organisateurs');

    component.setFilter('Étudiants');
    expect(component.activeFilter).toBe('Étudiants');
  });

  it('should load users on init', () => {
    spyOn(component, 'loadUsers');
    component.ngOnInit();
    expect(component.loadUsers).toHaveBeenCalled();
  });

  it('should have showForm false by default', () => {
    expect(component.showForm).toBeFalse();
  });

  it('should toggle form when addUser is called', () => {
    component.addUser();
    expect(component.showForm).toBeTrue();
  });

  it('should reset form when cancelForm is called', () => {
    component.showForm = true;
    component.newUser.nom = 'Test';
    component.cancelForm();
    expect(component.showForm).toBeFalse();
    expect(component.newUser.nom).toBe('');
  });

  it('should validate required fields before submit', () => {
    component.newUser.nom = '';
    component.onSubmitNewUser();
    expect(component.errorMessage).toBe('Veuillez remplir tous les champs obligatoires');
  });

  it('should require matricule for student role', () => {
    component.newUser.nom = 'Test';
    component.newUser.prenom = 'Test';
    component.newUser.email = 'test@test.com';
    component.newUser.motDePasse = '123456';
    component.newUser.role = 'ROLE_ETUDIANT';
    component.newUser.matricule = '';

    component.onSubmitNewUser();
    expect(component.errorMessage).toBe('Le matricule est requis pour un étudiant');
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach } from 'vitest';
import CurrentEmployees from './CurrentEmployees';
import employeeReducer, { addEmployee } from '../../store/slices/employeeSlice';
import type { Employee } from '../../store/slices/employeeSlice';


/**
 * Mock du localStorage pour les tests
 * Le localStorage n'existe pas dans l'environnement de test Node.js,
 * donc on crée une version simulée avec toutes les méthodes nécessaires
 */
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},    
  removeItem: () => {},
  clear: () => {},
};

// Remplacer l'objet localStorage global par notre mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});


/**
 * Fonction utilitaire pour rendre le composant avec un store Redux configuré
 * 
 * @param initialState - État initial du store (employés)
 * @returns Object contenant les méthodes de Testing Library et le store
 */
const renderWithRedux = (initialState: { employees: Employee[] } = { employees: [] }) => {
  // Créer un store Redux spécifique pour chaque test
  const store = configureStore({
    reducer: {
      employees: employeeReducer,
    },
    preloadedState: {
      employees: {
        employees: initialState.employees, // Liste des employés fournie en paramètre
        loading: false,
        error: null,
      },
    },
  });

  // Rendre le composant enveloppé dans le Provider Redux
  return {
    ...render(
      <Provider store={store}>
        <CurrentEmployees />
      </Provider>
    ),
    store, // Retourner aussi le store pour pouvoir le manipuler dans les tests
  };
};

/**
 * Premier employé fictif pour les tests
 * Contient toutes les propriétés requises avec des valeurs réalistes
 */
const mockEmployee1 = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  startDate: '2023-01-01',
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  department: 'Engineering',
};

/**
 * Deuxième employé fictif pour tester l'affichage de plusieurs employés
 * Valeurs différentes pour vérifier que les bonnes données s'affichent
 */
const mockEmployee2 = {
  id: '2',
  firstName: 'Jane',
  lastName: 'Smith',
  dateOfBirth: '1985-05-15',
  startDate: '2022-03-01',
  street: '456 Oak Ave',
  city: 'Boston',
  state: 'MA',
  zipCode: '02101',
  department: 'Marketing',
};

describe('CurrentEmployees Component', () => {
  /**
   * Configuration exécutée avant chaque test individuel
   * Garantit un état propre pour chaque test (isolation)
   */
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Rendering', () => {
    /**
     * Test : Vérification que le titre de la page s'affiche correctement
     */
    it('renders the page title', () => {
      renderWithRedux();
      
      // Vérifier la présence du titre H1
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Current Employees')).toBeInTheDocument();
    });

    /**
     * Test : Affichage du message "No employees found" quand la liste est vide
     */
    it('displays "No employees found" when no employees exist', () => {
      renderWithRedux();
      
      // Le message d'absence d'employés doit être affiché
      expect(screen.getByText('No employees found.')).toBeInTheDocument();
      // Le tableau ne doit PAS être dans le DOM
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    /**
     * Test : Le tableau s'affiche quand il y a des employés
     */
    it('renders table when employees exist', () => {
      renderWithRedux({ employees: [mockEmployee1] }); // Un employé dans l'état initial
      
      // Le tableau doit être présent
      expect(screen.getByRole('table')).toBeInTheDocument();
      // Le message "No employees" ne doit plus être affiché
      expect(screen.queryByText('No employees found.')).not.toBeInTheDocument();
    });

    /**
     * Test : Vérification que tous les en-têtes de colonnes sont présents
     */
    it('renders table headers correctly', () => {
      renderWithRedux({ employees: [mockEmployee1] });
      
      // Vérifier chaque en-tête de colonne
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Start Date')).toBeInTheDocument();
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Date of Birth')).toBeInTheDocument();
      expect(screen.getByText('Street')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
      expect(screen.getByText('State')).toBeInTheDocument();
      expect(screen.getByText('Zip Code')).toBeInTheDocument();
    });
  });
  
  describe('Employee Data Display', () => {
    /**
     * Test : Affichage correct des données d'un seul employé
     */
    it('displays single employee data correctly', () => {
      renderWithRedux({ employees: [mockEmployee1] });
      
      // Vérifier que chaque donnée de mockEmployee1 est affichée
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('2023-01-01')).toBeInTheDocument();
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      expect(screen.getByText('1990-01-01')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('New York')).toBeInTheDocument();
      expect(screen.getByText('NY')).toBeInTheDocument();
      expect(screen.getByText('10001')).toBeInTheDocument();
    });

    /**
     * Test : Affichage correct de plusieurs employés simultanément
     */
    it('displays multiple employees data correctly', () => {
      renderWithRedux({ employees: [mockEmployee1, mockEmployee2] });
      
      // Vérifier les données du premier employé
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      
      // Vérifier les données du deuxième employé
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('Smith')).toBeInTheDocument();
      expect(screen.getByText('Marketing')).toBeInTheDocument();
      expect(screen.getByText('Boston')).toBeInTheDocument();
      expect(screen.getByText('MA')).toBeInTheDocument();
    });

    /**
     * Test : Vérification du nombre correct de lignes dans le tableau
     */
    it('renders correct number of table rows', () => {
      renderWithRedux({ employees: [mockEmployee1, mockEmployee2] });
      
      const tableRows = screen.getAllByRole('row');
      // 1 ligne d'en-tête + 2 lignes de données = 3 lignes totales
      expect(tableRows).toHaveLength(3);
    });
  });
  
  describe('Redux Integration', () => {
    /**
     * Test : Le composant affiche les employés provenant du store Redux
     */
    it('displays employees from Redux store', async () => {
      const { store } = renderWithRedux(); // Commencer avec un store vide
      
      // Vérifier l'état initial vide
      expect(screen.getByText('No employees found.')).toBeInTheDocument();
      
      // Ajouter un employé via une action Redux
      store.dispatch(addEmployee({
        firstName: 'TestEmployee',
        lastName: 'FromStore',
        dateOfBirth: '1995-01-01',
        startDate: '2024-01-01',
        street: '789 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        department: 'Test Department',
      }));
      
      // Attendre que le composant se mette à jour automatiquement
      // waitFor est nécessaire car la mise à jour peut être asynchrone
      await waitFor(() => {
        expect(screen.getByText('TestEmployee')).toBeInTheDocument();
        expect(screen.getByText('FromStore')).toBeInTheDocument();
      });
      
      // Vérifier que le message "No employees" a disparu
      expect(screen.queryByText('No employees found.')).not.toBeInTheDocument();
    });

    /**
     * Test : Le composant se met à jour quand de nouveaux employés sont ajoutés
     */
    it('updates when new employees are added to store', async () => {
      const { store } = renderWithRedux({ employees: [mockEmployee1] });
      
      // Vérifier qu'un seul employé est affiché initialement
      expect(screen.getAllByRole('row')).toHaveLength(2); // 1 en-tête + 1 données
      
      // Ajouter un nouvel employé via Redux
      store.dispatch(addEmployee({
        firstName: 'NewEmployee',
        lastName: 'AddedLater',
        dateOfBirth: '1992-01-01',
        startDate: '2024-01-01',
        street: '999 New St',
        city: 'New City',
        state: 'New State',
        zipCode: '99999',
        department: 'New Department',
      }));
      
      // Attendre que la table se mette à jour avec le nouvel employé
      await waitFor(() => {
        expect(screen.getAllByRole('row')).toHaveLength(3); // 1 en-tête + 2 données
      });
      
      // Vérifier que le nouvel employé est affiché
      expect(screen.getByText('NewEmployee')).toBeInTheDocument();
      expect(screen.getByText('AddedLater')).toBeInTheDocument();
    });
  });
  
  describe('Table Structure', () => {
    /**
     * Test : Vérification de la structure HTML correcte du tableau
     */
    it('has correct table structure with thead and tbody', () => {
      renderWithRedux({ employees: [mockEmployee1] });
      
      const table = screen.getByRole('table');
      // Vérifier la présence des éléments structurels du tableau
      expect(table.querySelector('thead')).toBeInTheDocument();
      expect(table.querySelector('tbody')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    /**
     * Test : Le composant peut gérer un grand nombre d'employés sans problème de performance
     */
    it('handles large number of employees', () => {
      // Générer 50 employés fictifs
      const manyEmployees = Array.from({ length: 50 }, (_, index) => ({
        id: `employee-${index + 1}`,
        firstName: `FirstName${index + 1}`,
        lastName: `LastName${index + 1}`,
        dateOfBirth: '1990-01-01',
        startDate: '2023-01-01',
        street: `${index + 1} Street`,
        city: 'City',
        state: 'State',
        zipCode: '12345',
        department: 'Department',
      }));
      
      renderWithRedux({ employees: manyEmployees });
      
      const tableRows = screen.getAllByRole('row');
      expect(tableRows).toHaveLength(51); // 1 en-tête + 50 lignes de données
      
      // Vérifier que quelques employés spécifiques sont bien affichés
      expect(screen.getByText('FirstName1')).toBeInTheDocument();
      expect(screen.getByText('FirstName50')).toBeInTheDocument();
    });
  });
});
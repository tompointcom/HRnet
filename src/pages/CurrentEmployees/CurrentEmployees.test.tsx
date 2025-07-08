import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach } from 'vitest';
import CurrentEmployees from './CurrentEmployees';
import employeeReducer, { addEmployee } from '../../store/slices/employeeSlice';
import type { Employee } from '../../store/slices/employeeSlice';

// Mock du localStorage
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Fonction helper pour render avec Redux
const renderWithRedux = (initialState: { employees: Employee[] } = { employees: [] }) => {
  const store = configureStore({
    reducer: {
      employees: employeeReducer,
    },
    preloadedState: {
      employees: {
        employees: initialState.employees,
        loading: false,
        error: null,
      },
    },
  });

  return {
    ...render(
      <Provider store={store}>
        <CurrentEmployees />
      </Provider>
    ),
    store,
  };
};

// Données de test
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
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders the page title', () => {
      renderWithRedux();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Current Employees')).toBeInTheDocument();
    });

    it('displays "No employees found" when no employees exist', () => {
      renderWithRedux();
      expect(screen.getByText('No employees found.')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('renders table when employees exist', () => {
      renderWithRedux({ employees: [mockEmployee1] });
      
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.queryByText('No employees found.')).not.toBeInTheDocument();
    });

    it('renders table headers correctly', () => {
      renderWithRedux({ employees: [mockEmployee1] });
      
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
    it('displays single employee data correctly', () => {
      renderWithRedux({ employees: [mockEmployee1] });
      
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

    it('displays multiple employees data correctly', () => {
      renderWithRedux({ employees: [mockEmployee1, mockEmployee2] });
      
      // Premier employé
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      
      // Deuxième employé
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('Smith')).toBeInTheDocument();
      expect(screen.getByText('Marketing')).toBeInTheDocument();
      expect(screen.getByText('Boston')).toBeInTheDocument();
      expect(screen.getByText('MA')).toBeInTheDocument();
    });

    it('renders correct number of table rows', () => {
      renderWithRedux({ employees: [mockEmployee1, mockEmployee2] });
      
      const tableRows = screen.getAllByRole('row');
      // 1 header row + 2 data rows = 3 total rows
      expect(tableRows).toHaveLength(3);
    });
  });

describe('Redux Integration', () => {
  it('displays employees from Redux store', async () => {
    const { store } = renderWithRedux();
    
    // Initialement vide
    expect(screen.getByText('No employees found.')).toBeInTheDocument();
    
    // Ajouter un employé via Redux
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
    await waitFor(() => {
      expect(screen.getByText('TestEmployee')).toBeInTheDocument();
      expect(screen.getByText('FromStore')).toBeInTheDocument();
    });
    
    // Vérifier que le message "No employees" a disparu
    expect(screen.queryByText('No employees found.')).not.toBeInTheDocument();
  });

  it('updates when new employees are added to store', async () => {
    const { store } = renderWithRedux({ employees: [mockEmployee1] });
    
    // Vérifier qu'un seul employé est affiché
    expect(screen.getAllByRole('row')).toHaveLength(2); // 1 header + 1 data
    
    // Ajouter un nouvel employé
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
    
  // Attendre que le composant se mette à jour
  await waitFor(() => {
    expect(screen.getAllByRole('row')).toHaveLength(3); // 1 header + 2 data rows
  });
    
    expect(screen.getByText('NewEmployee')).toBeInTheDocument();
    expect(screen.getByText('AddedLater')).toBeInTheDocument();
  });
});

  describe('Table Structure', () => {
    it('has correct table structure with thead and tbody', () => {
      renderWithRedux({ employees: [mockEmployee1] });
      
      const table = screen.getByRole('table');
      expect(table.querySelector('thead')).toBeInTheDocument();
      expect(table.querySelector('tbody')).toBeInTheDocument();
    });
  });

describe('Edge Cases', () => {
  it('handles empty string values gracefully', () => {
    const employeeWithEmptyValues = {
      id: 'empty-employee',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      startDate: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      department: '',
    };
    
    renderWithRedux({ employees: [employeeWithEmptyValues] });
    
    // Le tableau devrait toujours s'afficher même avec des valeurs vides
    expect(screen.getByRole('table')).toBeInTheDocument();
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(2); // 1 header + 1 data row
  });

  it('handles large number of employees', () => {
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
    expect(tableRows).toHaveLength(51); // 1 header + 50 data rows
    
    // Vérifier quelques employés
    expect(screen.getByText('FirstName1')).toBeInTheDocument();
    expect(screen.getByText('FirstName50')).toBeInTheDocument();
  });
});
});
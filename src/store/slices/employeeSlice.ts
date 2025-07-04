import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  startDate: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  department: string;
}

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

// Fonction pour charger depuis localStorage
const loadFromLocalStorage = (): Employee[] => {
  try {
    const serializedState = localStorage.getItem('employees');
    if (serializedState === null) {
      return [];
    }
    const employees = JSON.parse(serializedState);
    
    // S'assurer que tous les employés ont un ID
    return employees.map((employee: Employee, index: number) => ({
      ...employee,
      id: employee.id || `legacy-${Date.now()}-${index}`
    }));
  } catch (err) {
    console.error('Could not load state', err);
    // Retourner un tableau vide en cas d'erreur
    return [];
  }
};

// Fonction pour sauvegarder dans localStorage
const saveToLocalStorage = (employees: Employee[]) => {
  try {
    const serializedState = JSON.stringify(employees);
    localStorage.setItem('employees', serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    ...initialState,
    employees: loadFromLocalStorage(),
  },
  reducers: {
    addEmployee: (state, action: PayloadAction<Omit<Employee, 'id'>>) => {
      const newEmployee: Employee = {
        ...action.payload,
        id: Date.now().toString(), // Simple ID generation
      };
      state.employees.push(newEmployee);
      saveToLocalStorage(state.employees);
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(
        employee => employee.id !== action.payload
      );
      saveToLocalStorage(state.employees);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(
        employee => employee.id === action.payload.id
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
        saveToLocalStorage(state.employees);
      }
    },
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
      saveToLocalStorage(state.employees);
    },
    clearEmployees: (state) => {
      state.employees = [];
      localStorage.removeItem('employees');
    },
  },
});

export const {
  addEmployee,
  removeEmployee,
  updateEmployee,
  setEmployees,
  clearEmployees,
} = employeeSlice.actions;

export default employeeSlice.reducer;
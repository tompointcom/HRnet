import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/**
 * Interface Employee - Définit la structure d'un employé
 */
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

/**
 * Interface EmployeeState - État global du slice des employés
 */
interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

/**
 * État initial du slice
 * Configuration de base avant le chargement des données
 */
const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

/**
 * Fonction pour charger les employés depuis localStorage
 * @returns {Employee[]} Liste des employés ou tableau vide en cas d'erreur
 */
const loadFromLocalStorage = (): Employee[] => {
  try {
    const serializedState = localStorage.getItem('employees');
    
    // Si aucune donnée n'existe, retourner un tableau vide
    if (serializedState === null) {
      return [];
    }
    
    const employees = JSON.parse(serializedState);
    
    // S'assurer que tous les employés ont un ID
    return employees.map((employee: Employee, index: number) => ({
      ...employee,
      // Si l'employé n'a pas d'ID, en générer un unique basé sur le timestamp et l'index
      id: employee.id || `legacy-${Date.now()}-${index}`
    }));
  } catch (err) {
    // Gérer les erreurs de parsing JSON ou d'accès localStorage
    console.error('Could not load state', err);
    // Retourner un tableau vide en cas d'erreur pour éviter les crashes
    return [];
  }
};

/**
 * Fonction pour sauvegarder les employés dans localStorage
 * 
 * Sérialise et sauvegarde la liste des employés pour la persistance.
 * Gère les erreurs de sérialisation et d'écriture.
 * 
 * @param {Employee[]} employees - Liste des employés à sauvegarder
 */
const saveToLocalStorage = (employees: Employee[]) => {
  try {
    // Sérialiser les données en JSON
    const serializedState = JSON.stringify(employees);
    // Sauvegarder dans localStorage avec la clé 'employees'
    localStorage.setItem('employees', serializedState);
  } catch (err) {
    // Gérer les erreurs de sérialisation ou de quota localStorage
    console.error('Could not save state', err);
  }
};

/**
 * Slice Redux pour la gestion des employés
 * 
 * Utilise Redux Toolkit pour créer un slice avec reducers et actions.
 * Intègre automatiquement la persistance localStorage dans chaque action.
 */
const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    ...initialState,
    employees: loadFromLocalStorage(),
  },
  reducers: {
    
    /**
     * Action : Ajouter un nouvel employé
     * 
     * Reçoit les données d'un employé sans ID et :
     * 1. Génère un ID unique
     * 2. Ajoute l'employé à la liste
     * 3. Sauvegarde dans localStorage
     * 
     * @param state - État actuel du slice
     * @param action - Données de l'employé sans ID
     */
    addEmployee: (state, action: PayloadAction<Omit<Employee, 'id'>>) => {
      // Créer l'employé complet avec un ID généré
      const newEmployee: Employee = {
        ...action.payload,                    // Toutes les données du formulaire
        id: Date.now().toString(),            // ID basé sur timestamp
      };
      
      // Ajouter à la liste des employés
      state.employees.push(newEmployee);
      
      // Persister les changements dans localStorage
      saveToLocalStorage(state.employees);
    }
  }
});


export const {
  addEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CreateEmployee from './CreateEmployee';
import employeeReducer from '../../store/slices/employeeSlice';

/**
 * Mock du localStorage pour les tests
 * Utilise vi.fn() pour créer des fonctions espionnées (spy functions)
 * qui permettent de vérifier les appels et contrôler les retours
 */
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Remplacer l'objet localStorage global par notre mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

/**
 * Mock du composant ConfirmationModal externe
 * Simule le comportement de la modal sans dépendre du package externe
 * Permet de tester l'intégration sans les complexités de la vraie modal
 */
vi.mock('p14-modale', () => ({
  ConfirmationModal: ({
    isOpen,
    title,
    message,
    onClose,
    confirmText,
  }: {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
    confirmText: string;
  }) =>
    // Rendu conditionnel : modal visible seulement si isOpen = true
    isOpen ? (
      <div data-testid="confirmation-modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>{confirmText}</button>
      </div>
    ) : null
}));

/**
 * Fonction helper pour rendre un composant avec Redux configuré
 * 
 * @param component - Le composant React à tester
 * @returns Object contenant les méthodes Testing Library + le store
 */
const renderWithRedux = (component: React.ReactElement) => {
  // Créer un store Redux frais pour chaque test (isolation)
  const store = configureStore({
    reducer: {
      employees: employeeReducer,
    },
  });

  return {
    ...render(
      <Provider store={store}>
        {component}
      </Provider>
    ),
    store,
  };
};

/**
 * Interface TypeScript pour typer la fonction fillCompleteForm
 * Définit les méthodes userEvent utilisées dans la fonction
 */
interface FillCompleteFormUser {
    type: (element: HTMLElement, text: string) => Promise<void>;
    selectOptions: (element: HTMLElement, value: string) => Promise<void>;
}

/**
 * Fonction helper pour remplir tous les champs du formulaire
 * 
 * @param user - Instance userEvent configurée
 */
const fillCompleteForm = async (user: FillCompleteFormUser): Promise<void> => {

    await user.type(screen.getByLabelText('First Name:'), 'John');
    await user.type(screen.getByLabelText('Last Name:'), 'Doe');
    await user.type(screen.getByLabelText('Date of Birth:'), '1990-01-01');
    await user.type(screen.getByLabelText('Start Date:'), '2023-01-01');
    await user.type(screen.getByLabelText('Street:'), '123 Main St');
    await user.type(screen.getByLabelText('City:'), 'New York');
    
    await user.selectOptions(screen.getByLabelText('State:'), 'New York');
    await user.type(screen.getByLabelText('Zip:'), '10001');
    await user.selectOptions(screen.getByLabelText('Department:'), 'Engineering');
};

/**
 * Configuration exécutée avant chaque test individuel
 * Garantit un état propre et prévisible pour chaque test
 */
beforeEach(() => {
  localStorageMock.clear();
  localStorageMock.getItem.mockReturnValue(null);
  vi.clearAllMocks();
});


describe('CreateEmployee Component', () => {
  
  describe('Rendering', () => {
    /**
     * Test : Vérification que le titre du formulaire s'affiche
     */
    it('renders the form title', () => {
      renderWithRedux(<CreateEmployee />);
      
      // Vérifier la présence du titre H1
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Create Employee')).toBeInTheDocument();
    });

    /**
     * Test : Vérification que tous les champs du formulaire sont présents
     * Utilise getByLabelText qui teste à la fois la présence du champ ET de son label
     */
    it('renders the form fields', () => {
      renderWithRedux(<CreateEmployee />);
      
      expect(screen.getByLabelText('First Name:')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name:')).toBeInTheDocument();
      expect(screen.getByLabelText('Date of Birth:')).toBeInTheDocument();
      expect(screen.getByLabelText('Start Date:')).toBeInTheDocument();
      expect(screen.getByLabelText('Street:')).toBeInTheDocument();
      expect(screen.getByLabelText('City:')).toBeInTheDocument();
      expect(screen.getByLabelText('State:')).toBeInTheDocument();
      expect(screen.getByLabelText('Zip:')).toBeInTheDocument();
      expect(screen.getByLabelText('Department:')).toBeInTheDocument();
    });

    /**
     * Test : Vérification de la présence du bouton de soumission
     */
    it('renders the submit button', () => {
      renderWithRedux(<CreateEmployee />);
      
      // Rechercher le bouton par son rôle ET son nom accessible
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    /**
     * Test : Vérification de la structure sémantique du fieldset d'adresse
     */
    it('renders the address fieldset', () => {
      renderWithRedux(<CreateEmployee />);
      
      // Le fieldset doit être accessible via son role et son nom
      expect(screen.getByRole('group', { name: 'Address' })).toBeInTheDocument();
    });
  });

  
  describe('User Interactions', () => {
    /**
     * Test : Vérification que l'utilisateur peut saisir du texte dans les champs
     */
    it('allows user to type in input fields', async () => {
      const user = userEvent.setup();
      renderWithRedux(<CreateEmployee />);

      // Test de saisie dans le champ prénom
      const firstNameInput = screen.getByLabelText('First Name:');
      await user.type(firstNameInput, 'John');
      expect(firstNameInput).toHaveValue('John');

      // Test de saisie dans le champ nom
      const lastNameInput = screen.getByLabelText('Last Name:');
      await user.type(lastNameInput, 'Doe');
      expect(lastNameInput).toHaveValue('Doe');
    });

    /**
     * Test : Vérification que l'utilisateur peut sélectionner dans les dropdowns
     */
    it('allows user to select from dropdown menus', async () => {
      const user = userEvent.setup();
      renderWithRedux(<CreateEmployee />);

      // Test de sélection dans le dropdown des états
      const stateSelect = screen.getByLabelText('State:');
      await user.selectOptions(stateSelect, 'California');
      expect(stateSelect).toHaveValue('California');

      // Test de sélection dans le dropdown des départements
      const departmentSelect = screen.getByLabelText('Department:');
      await user.selectOptions(departmentSelect, 'Engineering');
      expect(departmentSelect).toHaveValue('Engineering');
    });
  });

  describe('Form Submission', () => {
    /**
     * Test : Soumission du formulaire avec données valides et affichage de la modal
     */
    it('submits form with valid data and shows modal', async () => {
      const user = userEvent.setup();
      renderWithRedux(<CreateEmployee />);

      // Remplir tout le formulaire avec la fonction helper
      await fillCompleteForm(user);

      // Cliquer sur le bouton de soumission
      await user.click(screen.getByRole('button', { name: 'Save' }));

      // Attendre que la modal apparaisse (action asynchrone)
      await waitFor(() => {
        expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
        expect(screen.getByText('Employee Created!')).toBeInTheDocument();
      });
    });

    /**
     * Test : Vérification que les données sont sauvegardées dans le store Redux
     */
    it('saves employee data to Redux store', async () => {
      const user = userEvent.setup();
      const { store } = renderWithRedux(<CreateEmployee />); // Récupérer le store

      await fillCompleteForm(user);
      await user.click(screen.getByRole('button', { name: 'Save' }));

      // Vérifier l'état du store après soumission
      await waitFor(() => {
        const state = store.getState();
        expect(state.employees.employees).toHaveLength(1); // Un employé ajouté
        
        // Vérifier que les données correspondent à ce qui a été saisi
        expect(state.employees.employees[0]).toMatchObject({
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          startDate: '2023-01-01',
          street: '123 Main St',
          city: 'New York',
          state: 'New York',
          zipCode: '10001',
          department: 'Engineering'
        });
        
        // Vérifier qu'un ID a été généré
        expect(state.employees.employees[0]).toHaveProperty('id');
      });
    });

    /**
     * Test : Vérification que les données sont sauvegardées dans localStorage
     */
    it('saves employee data to localStorage', async () => {
      const user = userEvent.setup();
      renderWithRedux(<CreateEmployee />);

      await fillCompleteForm(user);
      await user.click(screen.getByRole('button', { name: 'Save' }));

      // Vérifier que setItem a été appelé avec les bonnes données
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'employees',
          expect.stringContaining('"firstName":"John"')
        );
      });
    });

    /**
     * Test : Vérification que le formulaire est réinitialisé après soumission
     */
    it('resets form after submission', async () => {
      const user = userEvent.setup();
      renderWithRedux(<CreateEmployee />);

      await fillCompleteForm(user);
      
      // Vérifier qu'un champ contient des données avant soumission
      const firstNameInput = screen.getByLabelText('First Name:');
      expect(firstNameInput).toHaveValue('John');
      
      await user.click(screen.getByRole('button', { name: 'Save' }));

      // Vérifier que tous les champs sont vides après soumission
      await waitFor(() => {
        expect(firstNameInput).toHaveValue('');
      });

      expect(screen.getByLabelText('Last Name:')).toHaveValue('');
      expect(screen.getByLabelText('City:')).toHaveValue('');
      // ... autres champs réinitialisés
    });
  });
  
  describe('Modal Behavior', () => {
    /**
     * Test : Fermeture de la modal quand l'utilisateur clique sur OK
     */
    it('closes modal when OK button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRedux(<CreateEmployee />);

      // Déclencher l'affichage de la modal
      await fillCompleteForm(user);
      await user.click(screen.getByRole('button', { name: 'Save' }));

      // Vérifier que la modal est affichée
      await waitFor(() => {
        expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
      });

      // Cliquer sur le bouton OK de la modal
      await user.click(screen.getByText('OK'));

      // Vérifier que la modal a disparu
      await waitFor(() => {
        expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    /**
     * Test : Vérification que tous les champs ont l'attribut 'required'
     * Important pour la validation HTML5 native
     */
    it('has required attributes on all inputs', () => {
      renderWithRedux(<CreateEmployee />);

      // Vérifier l'attribut required sur tous les champs
      expect(screen.getByLabelText('First Name:')).toHaveAttribute('required');
      expect(screen.getByLabelText('Last Name:')).toHaveAttribute('required');
      expect(screen.getByLabelText('Date of Birth:')).toHaveAttribute('required');
      expect(screen.getByLabelText('Start Date:')).toHaveAttribute('required');
      expect(screen.getByLabelText('Street:')).toHaveAttribute('required');
      expect(screen.getByLabelText('City:')).toHaveAttribute('required');
      expect(screen.getByLabelText('State:')).toHaveAttribute('required');
      expect(screen.getByLabelText('Zip:')).toHaveAttribute('required');
      expect(screen.getByLabelText('Department:')).toHaveAttribute('required');
    });
  });
});
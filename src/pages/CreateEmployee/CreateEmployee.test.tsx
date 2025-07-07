import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CreateEmployee from './CreateEmployee';
import employeeReducer from '../../store/slices/employeeSlice';

// Mock du localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock du composant ConfirmationModal
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
    isOpen ? (
      <div data-testid="confirmation-modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>{confirmText}</button>
      </div>
    ) : null
}));

// Fonction helper pour render avec Redux
const renderWithRedux = (component: React.ReactElement) => {
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

// Fonction pour remplir le formulaire
interface FillCompleteFormUser {
    type: (element: HTMLElement, text: string) => Promise<void>;
    selectOptions: (element: HTMLElement, value: string) => Promise<void>;
}

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

// Nettoyer localStorage avant chaque test
beforeEach(() => {
  localStorageMock.clear();
  localStorageMock.getItem.mockReturnValue(null);
  vi.clearAllMocks();
});

describe('CreateEmployee Component', () => {
  describe('Rendering', () => {
    it('renders the form title', () => {
      renderWithRedux(<CreateEmployee />);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Create Employee')).toBeInTheDocument();
    });

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

    it('renders the submit button', () => {
      renderWithRedux(<CreateEmployee />);
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('renders the address fieldset', () => {
      renderWithRedux(<CreateEmployee />);
      expect(screen.getByRole('group', { name: 'Address' })).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('allows user to type in input fields', async () => {
      const user = userEvent.setup();
      renderWithRedux(<CreateEmployee />);

      const firstNameInput = screen.getByLabelText('First Name:');
      await user.type(firstNameInput, 'John');
      expect(firstNameInput).toHaveValue('John');

      const lastNameInput = screen.getByLabelText('Last Name:');
      await user.type(lastNameInput, 'Doe');
      expect(lastNameInput).toHaveValue('Doe');
    });

    it('allows user to select from dropdown menus', async () => {
      const user = userEvent.setup();
      renderWithRedux(<CreateEmployee />);

      const stateSelect = screen.getByLabelText('State:');
      await user.selectOptions(stateSelect, 'California');
      expect(stateSelect).toHaveValue('California');

      const departmentSelect = screen.getByLabelText('Department:');
      await user.selectOptions(departmentSelect, 'Engineering');
      expect(departmentSelect).toHaveValue('Engineering');
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid data and shows modal', async () => {
      const user = userEvent.setup();
      renderWithRedux(<CreateEmployee />);

      await fillCompleteForm(user);

      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
        expect(screen.getByText('Employee Created!')).toBeInTheDocument();
      });
    });

    it('saves employee data to Redux store', async () => {
      const user = userEvent.setup();
      const { store } = renderWithRedux(<CreateEmployee />);

      await fillCompleteForm(user);
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        const state = store.getState();
        expect(state.employees.employees).toHaveLength(1);
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
        expect(state.employees.employees[0]).toHaveProperty('id');
      });
    });

    it('saves employee data to localStorage', async () => {
      const user = userEvent.setup();
      renderWithRedux(<CreateEmployee />);

      await fillCompleteForm(user);
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'employees',
          expect.stringContaining('"firstName":"John"')
        );
      });
    });

    it('resets form after submission', async () => {
      const user = userEvent.setup();
      renderWithRedux(<CreateEmployee />);

      await fillCompleteForm(user);
      
      const firstNameInput = screen.getByLabelText('First Name:');
      expect(firstNameInput).toHaveValue('John');
      
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(firstNameInput).toHaveValue('');
      });

      expect(screen.getByLabelText('Last Name:')).toHaveValue('');
      expect(screen.getByLabelText('City:')).toHaveValue('');
    });
  });

  describe('Modal Behavior', () => {
    it('closes modal when OK button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRedux(<CreateEmployee />);

      await fillCompleteForm(user);
      await user.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
      });

      await user.click(screen.getByText('OK'));

      await waitFor(() => {
        expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('has required attributes on all inputs', () => {
      renderWithRedux(<CreateEmployee />);

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
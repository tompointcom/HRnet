import styles from './CreateEmployee.module.css';
import { useState } from 'react';
import { states } from '../../data/states';
import { ConfirmationModal } from 'p14-modale';
import { useAppDispatch } from '../../hooks/redux';
import { addEmployee } from '../../store/slices/employeeSlice';


function CreateEmployee() {
  const dispatch = useAppDispatch();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [department, setDepartment] = useState('');
    const [showModal, setShowModal] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEmployee = {
      firstName,
      lastName,
      dateOfBirth,
      startDate,
      street,
      city,
      state,
      zipCode,
      department
    };

    dispatch(addEmployee(newEmployee));
    
    // Réinitialiser le formulaire
    setFirstName('');
    setLastName('');
    setDateOfBirth('');
    setStartDate('');
    setStreet('');
    setCity('');
    setState('');
    setZipCode('');
    setDepartment('');
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.formContainer}>
      <h1>Create Employee</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label className={styles.labelText} htmlFor='firstName'>First Name:</label>
          <input
            id='firstName'
            className={styles.input}
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className={styles.labelText} htmlFor='lastName'>Last Name:</label>
          <input
            id='lastName'
            className={styles.input}
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className={styles.labelText} htmlFor='dateOfBirth'>Date of Birth:</label>
          <input
            id='dateOfBirth'
            className={styles.input}
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className={styles.labelText} htmlFor='startDate'>Start Date:</label>
          <input
            id='startDate'
            className={styles.input}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        
        <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Address</legend>
            
            <div>
                <label className={styles.labelText} htmlFor='street'>Street:</label>
                <input
                id='street'
                className={styles.input}
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                />
            </div>
            
            <div className={styles.addressRow}>
                <div className={`${styles.addressField} ${styles.city}`}>
                <label className={styles.labelText} htmlFor='city'>City:</label>
                <input
                    id='city'
                    className={styles.input}
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                </div>
                
                <div className={`${styles.addressField} ${styles.state}`}>
                <label className={styles.labelText} htmlFor='state'>State:</label>
                <select
                    id='state'
                    className={styles.input}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                >
                    <option value="">Select a state</option>
                    {states.map((state) => (
                        <option key={state.abbreviation} value={state.name}>
                            {state.name} ({state.abbreviation})
                        </option>
                    ))}
                </select> 
                </div>
                
                <div className={`${styles.addressField} ${styles.zip}`}>
                <label className={styles.labelText} htmlFor='zip'>Zip:</label>
                <input
                    id='zip'
                    className={styles.input}
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                />
                </div>
            </div>
        </fieldset>
        
        <div>
          <label className={styles.labelText} htmlFor='department'>Department:</label>
            <select
              id='department'
              className={styles.input}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Legal">Legal</option>
            </select>
        </div>
        
        <button type="submit" className={styles.saveButton}>Save</button>
      </form>

      {/* Modale de confirmation */}
      <ConfirmationModal
        isOpen={showModal}
        title="Employee Created!"
        message="The employee has been successfully added to the database."
        onClose={closeModal}
        confirmText="OK"
      />
    </div>
  );
}

export default CreateEmployee;
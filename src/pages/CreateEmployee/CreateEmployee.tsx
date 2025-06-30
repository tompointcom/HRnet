import styles from './CreateEmployee.module.css';
import { useState } from 'react';
import { states } from '../../data/states';

export function CreateEmployee() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ firstName, lastName, dateOfBirth, startDate, street, city, state, zipCode, department });
  };

  return (
    <div className={styles.formContainer}>
      <h1>Create Employee</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label className={styles.labelText}>First Name:</label>
          <input
            className={styles.input}
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className={styles.labelText}>Last Name:</label>
          <input
            className={styles.input}
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className={styles.labelText}>Date of Birth:</label>
          <input
            className={styles.input}
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className={styles.labelText}>Start Date:</label>
          <input
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
                <label className={styles.labelText}>Street:</label>
                <input
                className={styles.input}
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                />
            </div>
            
            <div className={styles.addressRow}>
                <div className={`${styles.addressField} ${styles.city}`}>
                <label className={styles.labelText}>City:</label>
                <input
                    className={styles.input}
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                </div>
                
                <div className={`${styles.addressField} ${styles.state}`}>
                <label className={styles.labelText}>State:</label>
                <select
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
                <label className={styles.labelText}>Zip:</label>
                <input
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
          <label className={styles.labelText}>Department:</label>
          <select
            className={styles.input}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
          <option>Sales</option>
          <option>Marketing</option>
          <option>Engineering</option>
          <option>Human Resources</option>
          <option>Legal</option>
          </select>
        </div>
        
        <button type="submit" className={styles.saveButton}>Save</button>
      </form>
    </div>
  );
}
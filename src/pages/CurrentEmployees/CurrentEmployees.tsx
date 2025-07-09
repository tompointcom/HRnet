import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import styles from './CurrentEmployees.module.css';

/**
 * Composant CurrentEmployees
 * 
 * Page d'affichage de la liste de tous les employés enregistrés dans l'application.
 * Récupère les données depuis le store Redux et les affiche dans un tableau responsive.
 * 
 * @returns {JSX.Element} Le composant de liste des employés
 */
const CurrentEmployees: React.FC = () => {
  // Récupération de la liste des employés depuis le store Redux
  // useAppSelector permet d'accéder à l'état global de façon typée
  const employees = useAppSelector(state => state.employees.employees);

  return (
    <div className={styles.container}>
      <h1>Current Employees</h1>
      
      {/* Affichage conditionnel basé sur la présence d'employés */}
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        // Container du tableau avec wrapper pour le responsive
        <div className={styles.tableContainer}>
          <table className={styles.employeeTable}>
            
            {/* En-tête du tableau avec toutes les colonnes */}
            <thead>
              <tr>

                <th>First Name</th>
                <th>Last Name</th>
                
                <th>Start Date</th>
                <th>Department</th>
                
                <th>Date of Birth</th>
                
                <th>Street</th>
                <th>City</th>
                <th>State</th>
                <th>Zip Code</th>
              </tr>
            </thead>
            
            {/* Corps du tableau avec les données des employés */}
            <tbody>
              {/* Boucle sur chaque employé pour créer une ligne */}
              {employees.map((employee) => (
                // Ligne pour chaque employé avec key unique (employee.id)
                // La key est importante pour les performances React lors des re-rendus
                <tr key={employee.id}>
                  
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  
                  <td>{employee.startDate}</td>
                  <td>{employee.department}</td>

                  <td>{employee.dateOfBirth}</td>
                  
                  <td>{employee.street}</td>
                  <td>{employee.city}</td>
                  <td>{employee.state}</td>
                  <td>{employee.zipCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CurrentEmployees;
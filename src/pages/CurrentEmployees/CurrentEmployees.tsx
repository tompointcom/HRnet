import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import styles from './CurrentEmployees.module.css';

const CurrentEmployees: React.FC = () => {
  const employees = useAppSelector(state => state.employees.employees);

  return (
    <div className={styles.container}>
      <h1>Current Employees</h1>
      
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.employeeTable}>
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
            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee.id || `employee-${index}`}>
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
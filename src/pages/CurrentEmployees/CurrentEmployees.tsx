import styles from './CurrentEmployees.module.css';
import { useEffect, useState } from 'react';

interface Employee {
  firstName: string;
  lastName: string;
  startDate: string;
  department: string;
  dateOfBirth: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

function CurrentEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1>Current Employees</h1>
      </div>
      
      <div className={styles.tableControls}>
        <div className={styles.showEntries}>
          <label>
            Show 
            <select>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            entries
          </label>
        </div>
        
        <div className={styles.search}>
          <label>
            Search: 
            <input type="text" placeholder="" />
          </label>
        </div>
      </div>

      <table className={styles.employeeTable}>
        <thead>
          <tr>
            <th>First Name ▲</th>
            <th>Last Name</th>
            <th>Start Date ▲</th>
            <th>Department</th>
            <th>Date of Birth ▲</th>
            <th>Street ▲</th>
            <th>City ▲</th>
            <th>State ▲</th>
            <th>Zip Code ▲</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <tr key={index}>
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
            ))
          ) : (
            <tr>
              <td colSpan={9} className={styles.noEmployees}>
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.tableFooter}>
        <div className={styles.showing}>
          Showing {employees.length > 0 ? `1 to ${employees.length} of ${employees.length}` : '0 to 0 of 0'} entries
        </div>
        <div className={styles.pagination}>
          <button disabled>Previous</button>
          <button className={styles.active}>1</button>
          <button disabled>Next</button>
        </div>
      </div>
      
      <div className={styles.homeLink}>
        <a href="/">Home</a>
      </div>
    </div>
  );
}

export default CurrentEmployees;
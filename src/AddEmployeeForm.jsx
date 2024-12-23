import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddEmployeeForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        employee_id: '',
        email: '',
        phone_number: '',
        department: '',
        date_of_joining: '',
        role: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isUpdating, setIsUpdating] = useState(false); // To toggle between add and update modes
    const [employees, setEmployees] = useState([]); // To store the list of employees

    // Fetch the list of employees
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5001/get-employees');
            setEmployees(response.data);
        } catch (err) {
            setError('Failed to fetch employee data.');
        }
    };

    useEffect(() => {
        fetchEmployees(); // Fetch employees when the component loads
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const endpoint = isUpdating
                ? `http://localhost:5001/update-employee/${formData.employee_id}`
                : 'http://localhost:5001/add-employee';
            const method = isUpdating ? 'put' : 'post';

            const response = await axios[method](endpoint, formData);

            setMessage(response.data.message);
            setFormData({
                name: '',
                employee_id: '',
                email: '',
                phone_number: '',
                department: '',
                date_of_joining: '',
                role: '',
            });
            setIsUpdating(false); // Reset to add mode after successful update
            fetchEmployees(); // Refresh the employee list after submit
        } catch (err) {
            setError(err.response?.data?.message || 'Some error occurred.');
        }
    };

    const handleEdit = (employee) => {
        // Pre-fill the form with the selected employee's data for updating
        setFormData(employee);
        setIsUpdating(true);
    };

    const handleReset = () => {
        setFormData({
            name: '',
            employee_id: '',
            email: '',
            phone_number: '',
            department: '',
            date_of_joining: '',
            role: '',
        });
        setIsUpdating(false); // Reset to add mode
    };

    const handleDelete = async (employeeId) => {
        try {
            const response = await axios.delete(`http://localhost:5001/delete-employee/${employeeId}`);
            setMessage(response.data.message);
            fetchEmployees(); // Refresh the employee list after deletion
        } catch (err) {
            setError('Failed to delete employee.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Employee Management System</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Employee ID</label>
                    <input
                        type="text"
                        name="employee_id"
                        value={formData.employee_id}
                        onChange={handleChange}
                        className="form-control"
                        maxLength="10"
                        required
                        disabled={isUpdating} // Disable editing of employee_id during update
                    />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="form-control"
                        pattern="\d{10}"
                        title="Enter a valid 10-digit phone number"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Department</label>
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select your Department</option>
                        <option value="HR">HR</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="R&D">R&D</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label>Date of Joining</label>
                    <input
                        type="date"
                        name="date_of_joining"
                        value={formData.date_of_joining}
                        onChange={handleChange}
                        className="form-control"
                        max={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Role</label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {isUpdating ? 'Update Employee' : 'Add Employee'}
                </button>
                <button
                    type="reset"
                    className="btn btn-secondary ms-2"
                    onClick={handleReset}
                >
                    Reset
                </button>
            </form>

            {/* Employee List */}
            <div className="mt-4">
                <h3>Employee List</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Employee ID</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.employee_id}>
                                <td>{employee.name}</td>
                                <td>{employee.employee_id}</td>
                                <td>{employee.email}</td>
                                <td>{employee.phone_number}</td>
                                <td>{employee.department}</td>
                                <td>{employee.role}</td>
                                <td>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => handleEdit(employee)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger ms-2"
                                        onClick={() => handleDelete(employee.employee_id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AddEmployeeForm;

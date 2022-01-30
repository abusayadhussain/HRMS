import React, { useState } from "react";
import EmployeeDataService from '../service/employee.service';

const AddEmployee = () => {
    const initialEmployeeState = {
        id: null,
        firstName: "",
        lastName: "",
        email: ""
    };
    const [employee, setEmployee] = useState(initialEmployeeState);
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState("");

    const handleInputChange = event => {
        const { name, value } = event.target;
        setEmployee({ ...employee, [name]: value });
    };

    const saveEmployee = () => {
        let data = {
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email
        };

        EmployeeDataService.create(data)
            .then(response => {
                console.log(response.data.message)
                if(response.data.message){
                    setMessage(response.data.message);
                    setSubmitted(false);
                }else{
                    setEmployee({
                        id: response.data.id,
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        email: response.data.email
                    });
                    console.log(response);
                    setSubmitted(true);
                    console.log(response.data);
                }
            })
            .catch(e => {
                console.log(e.message);

            });
    };

    const newEmployee = () => {
        setEmployee(initialEmployeeState);
        setSubmitted(false);
    };

    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>You submitted successfully!</h4>
                    <button className="btn btn-success" onClick={newEmployee}>
                        Add
                    </button>
                </div>
            ) : (
                <div>
                    <h3 className="text-justify align-center">Add Employee</h3>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name (Required)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            required
                            value={employee.firstName}
                            onChange={handleInputChange}
                            name="firstName"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name (Required)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            required
                            value={employee.lastName}
                            onChange={handleInputChange}
                            name="lastName"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email (Required)</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            required
                            value={employee.email}
                            onChange={handleInputChange}
                            name="email"
                        />
                    </div>
                    <div>
                        { message ? message: null }
                    </div>
                    <button onClick={saveEmployee} className="btn btn-success">
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddEmployee;
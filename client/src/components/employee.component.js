import React, { useState, useEffect } from "react";
import EmployeeDataService from "../service/employee.service";

const Employee = props => {
    const initialEmployeeState = {
        id: null,
        firstName: "",
        lastName: "",
        email: ""
    };
    const [currentEmployee, setCurrentEmployee] = useState(initialEmployeeState);
    const [message, setMessage] = useState("");

    const getEmployee = id => {
        EmployeeDataService.get(id)
            .then(response => {
                setCurrentEmployee(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    useEffect(() => {
        getEmployee(props.match.params.id);
    }, [props.match.params.id]);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentEmployee({ ...currentEmployee, [name]: value });
    };

    const updateEmployee = () => {
        EmployeeDataService.update(currentEmployee.id, currentEmployee)
            .then(response => {
                console.log(response.data);
                setMessage("The employee was updated successfully!");
            })
            .catch(e => {
                console.log(e);
            });
    };

    const deleteEmployee = () => {
        EmployeeDataService.delete(currentEmployee.id)
            .then(response => {
                console.log(response.data);
                props.history.push("/employees");
            })
            .catch(e => {
                console.log(e);
            });
    };

    return (
        <div>
            {currentEmployee ? (
                <div className="edit-form">
                    <h4>Employee</h4>
                    <form>
                        <div className="form-group">
                            <label htmlFor="firstName">firstName</label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                name="firstName"
                                value={currentEmployee.firstName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">lastName</label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                name="lastName"
                                value={currentEmployee.lastName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                name="email"
                                value={currentEmployee.email}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>

                        <button className="badge badge-danger mr-2" onClick={deleteEmployee}>
                            Delete
                        </button>

                        <button
                            type="submit"
                            className="badge badge-success"
                            onClick={updateEmployee}
                        >
                            Update
                        </button>
                        <p>{message}</p>
                </div>
                ) : (
                <div>
                <br />
                <p>Please click on a Employee...</p>
                </div>
                )}
                </div>
    );
};

export default Employee;


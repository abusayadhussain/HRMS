import React, { Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import './App.css';
import {Link, Route, Switch} from "react-router-dom";

import AddEmployee from "./components/add-employee.component";
import EmployeeList from "./components/employee-list.component";
import Employee from "./components/employee.component";

class App extends Component{
  render() {
    return (
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <a href="/employees" className="navbar-brand">
              Home
            </a>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/employees"} className="nav-link">
                  Employees
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/add"} className="nav-link">
                  Add
                </Link>
              </li>
            </div>
          </nav>

          <div className="container mt-3">
            <Switch>
              <Route exact path={["/", "/employees"]} component={EmployeeList} />
              <Route exact path="/add" component={AddEmployee} />
              <Route path="/employees/:id" component={Employee} />
            </Switch>
          </div>
        </div>
    );
  }
}

export default App;

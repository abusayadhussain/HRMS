import React, { useState, useEffect, useMemo, useRef } from "react";
import  {useTable}  from "react-table";
import EmployeeDataService from '../service/employee.service';

const EmployeeList = (props) => {
    const [employees, setEmployees] = useState([]);
    const [searchEmail, setSearchEmail] = useState("");
    const employeesRef = useRef();

    employeesRef.current = employees;

    useEffect(() => {
        retrieveEmployees();
    }, []);

    const onChangeSearchEmail = (e) => {
        const searchEmail = e.target.value;
        setSearchEmail(searchEmail);
    };

    const retrieveEmployees = () => {
        EmployeeDataService.getAll()
            .then((response) => {
                setEmployees(response.data.items);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const refreshList = () => {
        retrieveEmployees();
    };

    const removeAllEmployees = () => {
        EmployeeDataService.deleteAll()
            .then((response) => {
                console.log(response.data.items);
                refreshList();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByEmail = () => {
        EmployeeDataService.findByEmail(searchEmail)
            .then((response) => {
                setEmployees(response.data.items);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const openEmployee = (rowIndex) => {
        const id = employeesRef.current[rowIndex].id;

        props.history.push("/employees/" + id);
    };

    const deleteEmployee = (rowIndex) => {
        const id = employeesRef.current[rowIndex].id;

        EmployeeDataService.delete(id)
            .then((response) => {
                props.history.push("/employees");

                let newEmployees = [...employeesRef.current];
                newEmployees.splice(rowIndex, 1);

                setEmployees(newEmployees);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const columns = useMemo(
        () => [
        {
            Header: "First Name",
            accessor: "firstName",
        },
        {
            Header: "Last Name",
            accessor: "lastName",
        },
        {
            Header: "Email",
            accessor: "email",
        },
        {
            Header: "Actions",
            accessor: "actions",
            Cell: (props) => {
                const rowIdx = props.row.id;
                return (
                    <div>
                        <span  onClick={() => openEmployee(rowIdx)}>
                            <i className="fas fa-pen"></i>
                        </span>

                        <span className="pad-left" onClick={() => deleteEmployee(rowIdx)}>
                            <i className="fas fa-trash action"></i>
                        </span>
                    </div>
                );
            },
        }
    ],
    []
    );


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data: employees,
    });

    return (
        <div className="list row">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by email"
                        value={searchEmail}
                        onChange={onChangeSearchEmail}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByEmail}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-md-12 list">
                <table
                    className="table table-striped table-bordered"
                    {...getTableProps()}
                >
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="col-md-8">
                <button className="btn btn-sm btn-danger" onClick={removeAllEmployees}>
                    Remove All
                </button>
            </div>
        </div>
);
};

export default EmployeeList;


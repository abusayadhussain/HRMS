import React, { useState, useEffect, useMemo, useRef } from "react";
import  {useTable}  from "react-table";
import Pagination from "@material-ui/lab/Pagination";
import EmployeeDataService from '../service/employee.service';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import { Watch } from 'react-loader-spinner';

const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();
    return (
        promiseInProgress &&
        <div
            style={{
                width: "100%",
                height: "100",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
      <Watch
          heigth="75"
          width="75"
          ariaLabel='loading'
          color="#008080"
      />
        </div>
    );
}

const EmployeeList = (props) => {
    const initialMailBody = {
        subject: "",
        body: ""
    };
    const [currentMailBody, setCurrentMailBody] = useState(initialMailBody);
    const [employees, setEmployees] = useState([]);
    const [searchEmail, setSearchEmail] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [checkedBoxValue, setCheckedBoxValue] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);


    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const pageSizes = [5, 10, 15];
    const employeesRef = useRef();
    const checkboxRef = useRef("");
    const checkedBoxEmailRef = useRef([]);


    employeesRef.current = employees;


    const onChangeSearchEmail = (e) => {
        const searchEmail = e.target.value;
        setSearchEmail(searchEmail);
    };

    const getRequestParams = (searchEmail, page, pageSize) => {
        let params = {};

        if (searchEmail) {
            params["email"] = searchEmail;
        }

        if (page) {
            params["page"] = page - 1;
        }

        if (pageSize) {
            params["size"] = pageSize;
        }

        return params;
    }

    const retrieveEmployees = () => {
        const params = getRequestParams(searchEmail, page, pageSize);
        EmployeeDataService.getAll(params)
            .then((response) => {
                const employees  = response.data.items;
                const totalPages = response.data.totalPages;
                setEmployees(employees);
                setCount(totalPages);
            })
            .catch((e) => {
                console.log(e);
            });

    };

    useEffect(retrieveEmployees, [page, pageSize]);


    const findByEmail = () => {
        getRequestParams(searchEmail);
        setPage(1);
        retrieveEmployees();
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPage(1);
    };

    let mails = [];
    const handleOnChange = (event) => {
        const mail = event.target.id;
        console.log(event.target.id);
        mails.push(mail);
        setIsChecked(checkboxRef.current.checked)
        if(event.target.checked === true){
            setCheckedBoxValue(checkedBoxEmailRef.current.concat(mails));
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentMailBody({ ...currentMailBody, [name]: value });
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

    const sendMail = () => {
        let mailBody = {
            to: checkedBoxValue,
            subject: currentMailBody.subject,
            body: currentMailBody.body,
        }
        trackPromise(
        EmployeeDataService.sendMail(mailBody)
            .then(res=>{
                setMessage("Mail send to selected employees successfully!");
                setSubmitted(true)

            })
            .catch(e => {
                console.log(e);
            })
    )
    }

    const newMailBody = () => {
        setCurrentMailBody(initialMailBody);
        setSubmitted(false);
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
                const rowEmail = props.row.cells[0].row.original.email;
                return (
                    <div>
                        <span>
                            <input
                                id={rowEmail}
                                type="checkbox"
                                ref={checkboxRef}
                                onChange={handleOnChange}
                            />
                        </span>
                        <span  className="pad-left" onClick={() => openEmployee(rowIdx)}>
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
                    <div className="mt-3">
                        {"Items per Page: "}
                        <select onChange={handlePageSizeChange} value={pageSize}>
                            {pageSizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>

                        <Pagination
                            className="my-3"
                            count={count}
                            page={page}
                            siblingCount={1}
                            boundaryCount={1}
                            variant="outlined"
                            shape="rounded"
                            onChange={handlePageChange}
                        />
                    </div>
                </div>

                <div className="col-md-8">
                    <button className="btn btn-sm btn-success" onClick={handleClickOpen}>
                        Send Mail
                    </button>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>MailBox</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Send Emails To selected employees
                            </DialogContentText>
                            <div className="submit-form">
                                {submitted ? (
                                    <div>
                                        <h4>{message}</h4>
                                        <button className="btn btn-success" onClick={newMailBody}>
                                            Send Mail
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="form-group">
                                            <label htmlFor="to">To</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="to"
                                                required
                                                value={checkedBoxValue}
                                                onChange={handleInputChange}
                                                name="subject"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="subject">Subject</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="subject"
                                                required
                                                value={currentMailBody.subject}
                                                onChange={handleInputChange}
                                                name="subject"
                                            />
                                        </div>

                                        <div className="form-group mb-2">
                                            <label htmlFor="body">body</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="body"
                                                required
                                                value={currentMailBody.body}
                                                onChange={handleInputChange}
                                                name="body"
                                            />
                                        </div>
                                    </div>)
                                }
                            </div>
                            <LoadingIndicator/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={sendMail}>Send Mail</Button>
                        </DialogActions>
                    </Dialog>

                </div>
            </div>
);
};

export default EmployeeList;


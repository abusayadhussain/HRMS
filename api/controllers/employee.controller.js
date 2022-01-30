const db = require("../models");
const nodemailer = require('nodemailer');
const Employee = db.employees;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require('../helpers/pagination.helper');

// Create and Save a new Tutorial
    exports.create = (req, res) => {
        // Validate request
        if (!req.body.firstName) {
            res.status(200).send({
                message: "First Name can not be empty!"
            });
            return;
        }
        if (!req.body.lastName) {
            res.status(200).send({
                message: "Last Name can not be empty!"
            });
            return;
        }
        if (!req.body.email) {
            res.status(200).send({
                message: "Email can not be empty!"
            });
            return;
        }


        // Create a Tutorial
        const employee = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        };

        // Save Employee in the database
        Employee.create(employee)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(200).send({
                message:
                    err.message || "Some error occurred while creating Employee."
            });
            });
    };

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const {page, size, email} = req.query;
    let condition = email ? { email: { [Op.like]: `%${email}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Employee.findAndCountAll({ where: condition, order:[['id', 'DESC']], limit, offset })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving emails."
            });
        });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Employee.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Employee with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Employee with id=" + id
            });
        });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Employee.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Employee was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Employee with id=${id}. Maybe Employee was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Employee with id=" + id
            });
        });
};

//Send mail to selected users
exports.sendMail = (req, res) => {
    let transport = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: process.env.MAILTRAPUSER,
            pass: process.env.MAILTRAPPASSWORD
        }
    });
    const mailList = [];
    let mails = req.body.to;
    mails.map((mail)=> {
        mailList.push(mail)
    });
    mailList.push();
    const message = {
        from: process.env.MAILTRAPFROMMAIL, // Sender address
        to: mailList,         // List of recipients
        subject: req.body.subject, // Subject line
        html: `
               <h3> Message from HRMS <h3>
                <p> ${ req.body.body } <p>
` // html body
    };
    transport.sendMail(message, function(err, info) {
        if (err) {
            res.send({
                message: `Mail not sent to employee.`
            });
            console.log(err)
        } else {
            res.send({
                message: "Mail sent to Employee successfully."
            })
        }
    });
}

// Delete a Employee with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Employee.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Employee was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Delete with id=${id}. Maybe Employee was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Employee with id=" + id
            });
        })
    }

// Delete all Tutorials from the database.
    exports.deleteAll = (req, res) => {
        Employee.destroy({
            where: {},
            truncate: false
        })
            .then(nums => {
                res.send({ message: `${nums} Employees were deleted successfully!` });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while removing all employees."
                });
            });
    };
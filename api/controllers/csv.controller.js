const db = require("../models");
const Employee = db.employees;

const fs = require("fs");
const csv = require("fast-csv");

exports.upload = async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send("Please upload a CSV file!");
        }

        let employees = [];
        let path = __basedir + "/resources/static/assets/uploads/" + req.file.filename;

        await fs.createReadStream(path)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", (row) => {
                employees.push(row);
            })
            .on("end", () => {
                Employee.bulkCreate(employees)
                    .then(() => {
                        res.status(200).send({
                            message:
                                "Uploaded the file successfully: " + req.file.originalname,
                        });
                    })
                    .catch((error) => {
                        res.status(500).send({
                            message: "Fail to import data into database!",
                            error: error.message,
                        });
                    });
            });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};



// module.exports = upload;
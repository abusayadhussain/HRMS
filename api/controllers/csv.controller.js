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
                let countSuccess = 0;
                let countError = 0;
                let count = 0;
                employees.map( async employee => {
                    try{
                        const createEmployee = await Employee.create(employee);
                        if(createEmployee.dataValues){
                            countSuccess++
                            count++;
                        }
                    }catch(err) {
                        console.log(err.message);
                        countError++;
                        count++;
                    }

                    if(employees.length === count){
                        res.status(200).send({
                            message: `${countSuccess} employee record(s) saved to database. ${countError} record(s) failed to save`,
                        });
                    }
                });
            });

        fs.unlinkSync(path);
    } catch (error) {
        console.log(error);
        res.status(200).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};
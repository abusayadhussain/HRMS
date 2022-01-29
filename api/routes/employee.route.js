module.exports = app => {
    const employees = require("../controllers/employee.controller");
    const csvController = require("../controllers/csv.controller");
    const upload = require("../middleware/upload.middleware");

    var router = require("express").Router();

    // Create a new Employee
    router.post("/", employees.create);

    // Retrieve all Employees
    router.get("/", employees.findAll);

    // Retrieve a single Employee with id
    router.get("/:id", employees.findOne);

    // Update a Employee with id
    router.put("/:id", employees.update);

    // Delete a Employee with id
    router.delete("/:id", employees.delete);

    // Delete all Employees
    router.delete("/", employees.deleteAll);

    //upload csv of employees
    router.post("/upload", upload.single("file"), csvController.upload);

    //Send Mail to employees
    router.post('/send-mail', employees.sendMail)

    app.use('/api/employees', router);
};

import http from "../helpers/api-call.helper";

class EmployeeDataService {
    getAll() {
        return http.get("/employees");
    }

    get(id) {
        return http.get(`/employees/${id}`);
    }

    create(data) {
        return http.post("/employees", data);
    }

    update(id, data) {
        return http.put(`/employees/${id}`, data);
    }

    delete(id) {
        return http.delete(`/employees/${id}`);
    }

    deleteAll() {
        return http.delete(`/employees`);
    }

    findByEmail(email) {
        return http.get(`/employees?email=${email}`);
    }
}

export default new EmployeeDataService();

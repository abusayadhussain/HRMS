import http from "../helpers/api-call.helper";

class EmployeeDataService {
    getAll(params) {
        return http.get("/employees", { params });
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

    upload(file, onUploadProgress) {
        let formData = new FormData();

        formData.append("file", file);

        return http.post("/employees/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        });
    }
}

export default new EmployeeDataService();

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

    sendMail(mailBody){
        return http.post("/employees/send-mail",mailBody)
    }
}

export default new EmployeeDataService();

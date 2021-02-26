import axios from "axios";

class ApiRequest {
  constructor(url = "http://localhost:3000/api/") {
    this.axiosInstance = axios.create({
      baseURL: url,
      timeout: 120000,
    });

    this.axiosInstance.interceptors.request.use(
      function(config) {
        return config;
      },
      function(error) {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      function(response) {
        return response;
      },
      function(error) {
        return Promise.reject(error);
      }
    );
  }

  setHeader(header) {
    this.axiosInstance.defaults.headers.common = header;
    this.axiosInstance.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";
    this.axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  }

  get(methodName, data) {
    return this.axiosInstance.get(methodName, {
      params: data,
    });
  }

  post(methodName, data) {
    return this.axiosInstance.post(methodName, data);
  }

  put(methodName, data) {
    return this.axiosInstance.put(methodName, data);
  }

  delete(methodName, param, data) {
    return this.axiosInstance.delete(methodName, {
      params: param,
      data: data,
    });
  }

  request(type, url, data) {
    let promise = null;
    switch (type) {
      case "GET":
        promise = axios.get(url, { params: data });
        break;
      case "POST":
        promise = axios.post(url, data);
        break;
      case "PUT":
        promise = axios.put(url, data);
        break;
      case "DELETE":
        promise = axios.delete(url, data);
        break;
      default:
        promise = axios.get(url, { params: data });
        break;
    }
    return promise;
  }
}

export default ApiRequest

import axios from "axios";

console.log("API URL:", process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

api.interceptors.request.use(
  (config) => {

    const role = localStorage.getItem("role");

    const token = role
      ? localStorage.getItem(`${role}_token`)
      : null;


    console.log("TOKEN SENT:", token);


    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
{/*import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const role = localStorage.getItem("role"); // active user type
  const token = role ? localStorage.getItem(`${role}_token`) : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;*/}
import axio from "axios";

const axioInstance = axio.create({
  baseURL: "http://127.0.0.1:5000/predict",
});

export default axioInstance;

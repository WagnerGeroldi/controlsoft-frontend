import axios from "axios";
import { getUserLocalStorage } from "../state/SaveLocalStorage";

const baseURL = "https://backend-unisoft.herokuapp.com/";

const api = axios.create({
  baseURL: baseURL,

  headers: {
    "Content-Type": "application/json",
  },
});

const user = getUserLocalStorage();

if (user) {
  api.defaults.headers.common["x-access-token"] = user.token;
  api.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
}

export { api };


/* https://backend-unisoft.herokuapp.com/ */

// "http://localhost:3333/"
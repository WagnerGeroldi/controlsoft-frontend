import axios from "axios";
import { getUserLocalStorage } from "../state/SaveLocalStorage";

const baseURL = "http://localhost:3333/";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "content-type": "application/json",
  },
});

const user = getUserLocalStorage();

if (user) {
  api.defaults.headers.common["x-access-token"] = user.token;
}

export { api };


/* https://controlsoft-node.herokuapp.com/ */

// "http://localhost:3333/"
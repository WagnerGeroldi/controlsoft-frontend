import { Link } from "react-router-dom";

/*imports MUI */

import Button from "@mui/material/Button";
import { Head } from "./partials/Head";

import { getUserLocalStorage } from "../state/SaveLocalStorage";
import { HeaderDefault } from "./partials/HeaderDefault";

export function Initial() {
  const userStorage = getUserLocalStorage();

  return (
    <>
      <Head title="Rede Unisoft - Controle de Estoque" />
      <HeaderDefault />
      <div className="card bg-light mt-5 p-5 w-100">
        <div className="d-flex justify-content-center ">
          {!userStorage ? (
            <div className="d-flex gap-3 flex-column justify-content-center mx-auto">
              <Link to="/login">
                <Button
                  className="mb-5 btn-default"
                  variant="contained"
                  color="primary"
                >
                  Clique para fazer login
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  className="btn-default"
                  variant="contained"
                  color="primary"
                >
                  Crie sua conta e começe agora
                </Button>
              </Link>
            </div>
          ) : (
            <div className="d-flex gap-3 flex-column justify-content-center mx-auto">
              <Link to={`/dashboard/${userStorage.id}`}>
                <Button variant="contained" color="primary" type="submit">
                  {`Continuar como ${userStorage.name}`}
                </Button>
              </Link>
              <Link to="/login">
                <Button color="primary">
                  {`Não é ${userStorage.name} cique aqui e faça login`}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/*import react */
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

/*import MUI */
import {
  Box,
  Grid,
  Paper,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

/*import CSS */
import "./styles/alert.scss";
import "react-toastify/dist/ReactToastify.css";

/*import Extras */
import useAuth from "../state/Auth";
import { api } from "../api/api";

/*import libs */
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  setAuthLocalStorage,
  setTokenLocalStorage,
  setUserLocalStorage,
} from "../state/SaveLocalStorage";

/*import componentes */
import { ButtonDefault } from "../components/Button";
import { Head } from "./partials/Head";

interface IUser {
  email: string;
  password: string;
}

/*validacao de dados */
const validationRegistrerUser = yup.object().shape({
  email: yup
    .string()
    .required("O email é obrigatório")
    .email("Digite um email válido"),
  password: yup
    .string()
    .required("A senha é obrigatória")
    .min(8, "A senha de ter pelo menos 8 caracteres"),
});

export function Login() {
  let navigate = useNavigate();
  const { user, setUser }: any = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  /*lidar com formulario */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    resolver: yupResolver(validationRegistrerUser),
  });

  /*consulta backend */
  const loginUser = (data: IUser) =>
    api
      .post("/users/validate", data)
      .then((response) => {
        setIsLoading(true);
        setTimeout(() => {
          setUserLocalStorage(response.data.user);
          setTokenLocalStorage(response.data.token);
          setAuthLocalStorage(response.data.auth);
          navigate("/dashboard/" + response.data.user.id);
          setUser(response.data);
        }, 2000);
      })
      .catch((error) => {
        switch (error.response.status) {
          case 300:
            setIsLoading(true);
            setUserLocalStorage(error.response.data);
            toast.error(error.response.data.message);
            setTimeout(() => {
              navigate("/updatePassword");
            }, 2000);
            break;
          case 401:
            toast.error("Senha inválida");
            break;
          case 400:
            toast.error(error.response.data.message);
            break;
          case 405:
            toast.error(error.response.data.errors[0].msg);
            break;
        }
      });

  function clearLocalStorage() {
    setUserLocalStorage(null);
  }

  return (
    <>
      <Head title="Rede Unisoft - Fazer Login" />

      <div className="container">
        <Card sx={{ maxWidth: 875 }}>
          <ToastContainer />
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              <i className="fa fa-user fa-2x" aria-hidden="true"></i> ACESSE SUA
              CONTA
            </Typography>
            <Paper sx={{ p: 2, margin: "auto", flexGrow: 1 }}>
              <Box
                onSubmit={handleSubmit(loginUser)}
                component="form"
                sx={{ flexGrow: 1 }}
                noValidate
                autoComplete="off"
              >
                <Grid container spacing={2}>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="email"
                      {...register("email")}
                      label="Email"
                      size="small"
                      fullWidth
                      placeholder="usuario@dominio.com"
                      variant="outlined"
                    />
                    <p className="error-message">{errors.email?.message}</p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="password"
                      size="small"
                      {...register("password")}
                      fullWidth
                      label="Senha"
                      type="password"
                      placeholder="sua senha..."
                      variant="outlined"
                    />
                    <p className="error-message">{errors.password?.message}</p>
                  </Grid>
                </Grid>
                <ButtonDefault
                  link="/register"
                  contentBtnPrimary={isLoading ? "Aguarde..." : "Acessar"}
                  contentBtnSecondary="Crie sua conta"
                />
                <br />

                <a href="/resetPassword" onClick={() => clearLocalStorage()}>
                  {" "}
                  Esqueci minha senha
                </a>
              </Box>
            </Paper>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

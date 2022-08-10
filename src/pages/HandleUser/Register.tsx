/* Imports REACT */
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

/* Imports MUI */
import {
  Box,
  Grid,
  Paper,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

/* Imports Libs */
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

/* Imports CSS */
import "../styles/alert.scss";
import "../styles/Register.scss";
import "react-toastify/dist/ReactToastify.css";

/* Imports Extras */
import { api } from "../../api/api";
import { ButtonDefault } from "../../components/Button";
import {
  getTokenLocalStorage,
  setUserLocalStorage,
} from "../../state/SaveLocalStorage";
import { Head } from "../partials/Head";

/*Interface*/
interface IUserRegister {
  name: string;
  email: string;
}

/* Validações */
const validationRegistrerUser = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  email: yup
    .string()
    .required("O email é obrigatório")
    .email("Digite um email válido"),
});

export function Register() {
  let navigate = useNavigate();
  const token = getTokenLocalStorage();
  const [isLoading, setIsLoading] = useState(false);

  /*lidar com formulário */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserRegister>({
    resolver: yupResolver(validationRegistrerUser),
  });

  /* consulta backend */
  const registerUser = (data: IUserRegister) =>
    api
      .post("/users", data, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setIsLoading(true);
        toast.success("Usuário cadastrado! Redirecionando");
        setTimeout(() => {
          setUserLocalStorage(data);
          navigate("/infocreateaccount");
        }, 2000);
      })
      .catch((err) => {
        const message =
          err.response.data.message || err.response.data.errors[0].msg;
        switch (err.response.status) {
          case 401:
            toast.error(message + "\n Redirecionando para login...");
            setTimeout(() => {
              navigate("/login");
            }, 4000);
            break;
          default:
            toast.error(message);
        }
      });

  return (
    <>
      <Head title="Rede Unisoft - Faça seu cadastro" />

      <div className="container">
        <Card sx={{ maxWidth: 875 }}>
          <ToastContainer />
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              <i className="fa fa-user-plus fa-2x" aria-hidden="true"></i> Crie
              sua conta
            </Typography>
            <br />
            <p>
              Para fazer seu cadastro apenas prencha este breve formulário,
              vamos enviar uma senha provisória em seu e-mail para que tenha
              acesso ao sistema, assim já validamos seu cadastro!
            </p>
            <Paper sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1 }}>
              <Box
                onSubmit={handleSubmit(registerUser)}
                component="form"
                sx={{ flexGrow: 1 }}
                noValidate
                autoComplete="off"
              >
                <Grid container spacing={2}>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="name"
                      {...register("name")}
                      label="Nome Completo"
                      variant="outlined"
                      fullWidth
                      placeholder="Exe: João da Silva"
                      size="small"
                    />
                    <p className="error-message">{errors.name?.message}</p>
                  </Grid>
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
                </Grid>
                <ButtonDefault
                  link="/login"
                  contentBtnPrimary={isLoading ? "Aguarde..." : "Cadastrar"}
                  contentBtnSecondary="Cancelar"
                />
              </Box>
            </Paper>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

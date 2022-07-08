import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Grid, Paper, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import useAuth from "../state/Auth";

import "./styles/alert.scss";
import "./styles/Login.scss";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import "./styles/Register.scss";
import { api } from "../api/api";
import { ButtonDefault } from "../components/Button";
import { useState } from "react";
import { setUserLocalStorage } from "../state/SaveLocalStorage";
import { getUserLocalStorage } from "../state/SaveLocalStorage";

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
 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationRegistrerUser),
  });

  const loginUser = (data: any) =>
    api
      .post("/users/validate", data)
      .then((response) => {
        setIsLoading(true);

        setTimeout(() => {
          setUserLocalStorage(response.data);
          navigate("/dashboard/" + response.data.user.id);
          setUser({
            logged: response.data.auth,
            email: response.data.user.email,
            name: response.data.user.name,
          });
        }, 2000);
      })
      .catch((error) => {
        console.log(error.response.data.user);

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
      <div className="container">
        <Card sx={{ maxWidth: 875 }}>
          <ToastContainer />
          <CardContent>
            <Typography
              sx={{ fontSize: 20 }}
              color="text.primary"
              gutterBottom
            >
              <i className="fa fa-user fa-2x" aria-hidden="true"></i> ACESSE SUA CONTA
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
                
                <a href="/resetPassword" onClick={() => clearLocalStorage()}> Esqueci minha senha</a>
              </Box>
            </Paper>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

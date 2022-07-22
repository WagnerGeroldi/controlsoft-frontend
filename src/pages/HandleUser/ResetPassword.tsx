/*imports react */
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

/*imports MUI */
import { Box, Grid, Paper, TextField, Card, CardContent, Typography } from "@mui/material";

/*imports CSS */
import "../styles/alert.scss";
import "react-toastify/dist/ReactToastify.css";

/*imports Libs */
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

/*imports extras */
import { api } from "../../api/api";
import { ButtonDefault } from "../../components/Button";
import { Head } from "../partials/Head";

/*interface*/

interface IResertPassword {
  email: string;
}

/* validação formulario */
const validationRegistrerUser = yup.object().shape({
  email: yup
    .string()
    .required("O email é obrigatório")
    .email("Digite um email válido"),
});

export function ResetPassword() {

  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IResertPassword>({
    resolver: yupResolver(validationRegistrerUser),
  });

  const recoverPassword = (data: IResertPassword) =>
    api
      .post("/users/recoverPassword", data)
      .then((res) => {
        setIsLoading(true)
          toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      })
      .catch((error) => {
        console.log(error)
        const message =
          error.response.data.message || error.response.data.errors[0].msg;

        toast.error(message);
      });

  return (
    <>
      <Head
    title= "ControlSoft - Reset de Senha"
    />
      <div className="container">
        <Card sx={{ maxWidth: 875 }}>
          <ToastContainer />
          <CardContent>
            <Typography
              sx={{ fontSize: 20 }}
              color="text.primary"
              gutterBottom
            >
             <i className="fa fa-refresh fa-2x" aria-hidden="true"></i> Recuperar senha
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.primary"
              gutterBottom
            >
              Uma senha provisória será enviada em seu email, use ela para acessar o sistema! <br />
              Quando acessar o sistema, você será redirecionado para trocar a senha!
            </Typography>
            <Paper sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1 }}>
              <Box
                onSubmit={handleSubmit(recoverPassword)}
                component="form"
                sx={{ flexGrow: 1 }}
                noValidate
                autoComplete="off"
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
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
                  contentBtnPrimary= {isLoading ? "Aguarde..." : "Recuperar senha"}
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

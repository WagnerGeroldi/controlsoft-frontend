/* imports React */
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

/* imports Mui */
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

/* imports libs */
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

/* imports css */
import "../styles/alert.scss";
import "../styles/UpdatePassword.scss";
import "../styles/Register.scss";
import "react-toastify/dist/ReactToastify.css";

/* imports extras */
import { getUserLocalStorage } from "../../state/SaveLocalStorage";
import { api } from "../../api/api";

/*import de componentes */
import { ButtonSubmit } from "../../components/ButtonSubmit";
import { ModalInfo } from "../../components/Modals/ModalInfo";

interface IPassword {
  password: string;
  newpassword: string;
  confirmnewpassword: string;
}

/*validacao form */
const validationRegistrerUser = yup.object().shape({
  password: yup
    .string()
    .required("A senha é obrigatória")
    .min(8, "A senha de ter pelo menos 8 caracteres"),
  newpassword: yup
    .string()
    .required("A senha é obrigatória")
    .min(8, "A senha de ter pelo menos 8 caracteres"),
  confirmnewpassword: yup
    .string()
    .oneOf([yup.ref("newpassword"), null], "Senhas não conferem")
    .required("A senha é obrigatória")
    .min(8, "A senha de ter pelo menos 8 caracteres"),
});

export function UpdatePassword() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = getUserLocalStorage();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const textModal = `Se você não trocar a senha agora, se seguir usando a senha
  provisória, toda vez que abrir o sistema, automaticamente será
  direcionado para este local para trocá-la. Faz um esforço e troque a senha!`;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPassword>({
    resolver: yupResolver(validationRegistrerUser),
  });

  const updatePassword = (data: IPassword) =>
    api
      .post("/users/updatePassword", { data, user })
      .then((res) => {
        setIsLoading(true);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/dashboard/" + user.id);
        }, 2500);
      })
      .catch((error) => {
        const message =
          error.response.data.message || error.response.data.errors[0].msg;

        toast.error(message);
      });

  return (
    <>
      <div className="container">
        <Card sx={{ maxWidth: 475 }}>
          <ToastContainer />
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              <i className="fa fa-wrench fa-2x" aria-hidden="true"></i>{" "}
              Atualizar senha
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Digite sua nova senha
            </Typography>
            <Paper sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1 }}>
              <Box
                onSubmit={handleSubmit(updatePassword)}
                component="form"
                sx={{ flexGrow: 1 }}
                noValidate
                autoComplete="off"
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      type="password"
                      id="password"
                      {...register("password")}
                      label="Digite a senha atual"
                      size="small"
                      fullWidth
                      placeholder="***************"
                      variant="outlined"
                    />
                    <p className="error-message">{errors.password?.message}</p>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="password"
                      id="newpassword"
                      {...register("newpassword")}
                      label="Digite sua nova senha"
                      size="small"
                      fullWidth
                      placeholder="**************"
                      variant="outlined"
                    />
                    <p className="error-message">
                      {errors.newpassword?.message}
                    </p>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="password"
                      id="confirmnewpassword"
                      {...register("confirmnewpassword")}
                      label="Repita sua nova senha"
                      size="small"
                      fullWidth
                      placeholder="**************"
                      variant="outlined"
                    />
                    <p className="error-message">
                      {errors.confirmnewpassword?.message}
                    </p>
                  </Grid>
                </Grid>
                <div className="container-btn">
                  <ButtonSubmit
                    contentBtnPrimary={
                      isLoading ? "Aguarde..." : "Alterar senha"
                    }
                  />
                  <Button onClick={handleOpen}>Cancelar</Button>
                </div>
              </Box>
            </Paper>
          </CardContent>
        </Card>
        <ModalInfo
          title="Tem certeza disto?"
          link={`/dashboard/${user.id}`}
          text={textModal}
          setOpen={open}
          setClose={handleClose}
        />
      </div>
    </>
  );
}

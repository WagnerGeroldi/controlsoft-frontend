/*imports react */
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

/*imports libs */
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

/*imports extras */
import { api } from "../api/api";
import { Header } from "./partials/Header";
import { ModalConfirm } from "../components/Modals/ModalConfirm";
import {
  getUserLocalStorage,
  setUserLocalStorage,
} from "../state/SaveLocalStorage";

/*imports styles CSS */
import "./styles/ConfigPage.scss";
import "react-toastify/dist/ReactToastify.css";

/*imports MUI */
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

/*INTERFACES */
interface UseFormInputs {
  birthday: number;
  name: string;
  cep: number;
  address: string;
}

const validationCreateResident = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  birthday: yup.date().required("Data é obrigatório"),
  password: yup.string().required("A senha é obrigatória"),
  address: yup.string().required("A rua é obrigatória"),
});

export function UpdateUser(this: any) {

  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const {user, token} = getUserLocalStorage();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const textModal = `Se você confirmar esta ação, não poderá reverter depois!
  Pense bem antes de confirmar a exclusão!`


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UseFormInputs>({
    resolver: yupResolver(validationCreateResident),
  });


  /*Consultas BACKEND */
  useEffect(() => {
    api
      .get("/users/" + id, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        reset(res.data);
      })
      .catch((err) => {
        switch (err.response.status) {
          case 401:
            toast.error(
              err.response.data.message + "\n Redirecionando para login..."
            );
            setTimeout(() => {
              navigate("/login");
            }, 4000);
            break;
          default:
            toast.error(err.response.data.message);
        }
      });
  }, []);

  const updateUser = (data: any) =>
    api
      .put(`/users/${id}`, data)
      .then((res) => {
        const message = res.data.message;
        setUserLocalStorage(data);
        toast.success(message);
        setTimeout(() => {
          navigate("/" + id);
        }, 1000);
      })
      .catch(() => {
        toast.error("Houve um erro, tente novamente");
      });

  async function deleteUser(id: string) {
    await api
      .delete("/users/" + id, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        const message = res.data.message;
        toast.success(message);
        navigate("/");
      });
  }

  return (
    <>
      <Header />
      <ToastContainer />
      <Paper
        sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1, marginTop: 3 }}
      >
        <div className="info-user">
          <h1> Dados do Usuário</h1>
        </div>
        <Box
          onSubmit={handleSubmit(updateUser)}
          component="form"
          sx={{ flexGrow: 1 }}
          noValidate
          autoComplete="off"
        >
          <Grid container spacing={2} padding={3}>
            <Grid item lg={4} md={6} xs={12}>
              <div className="adjust-grid">
                <label htmlFor="name" className="form-label">
                  Nome Completo:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  {...register("name")}
                  placeholder="Digite seu nome"
                />
                <p className="error-message">{errors.name?.message}</p>
              </div>
            </Grid>
            <Grid item lg={4} md={6} xs={12}>
              <div className="adjust-grid">
                <label htmlFor="name" className="form-label">
                  Data de Nascimento:
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="name"
                  {...register("birthday")}
                />
                <p className="error-message">{errors.birthday?.message}</p>
              </div>
            </Grid>

            <Grid container spacing={2} padding={3}>
              <Grid item lg={4} md={6} xs={12}>
                <div className="adjust-grid">
                  <label htmlFor="name" className="form-label">
                    CEP
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="name"
                    {...register("cep")}
                  />
                  <p className="error-message">{errors.birthday?.message}</p>
                </div>
              </Grid>
              <Grid item lg={4} md={6} xs={12}>
                <div className="adjust-grid">
                  <label htmlFor="name" className="form-label">
                    Rua
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="adress"
                    {...register("address")}
                  />
                  <p className="error-message">{errors.address?.message}</p>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Stack spacing={2} direction="row">
            <Button type="submit" variant="contained">
              Salvar
            </Button>
            <Link to="/users">
              <Button variant="contained" color="secondary">
                Cancelar
              </Button>
            </Link>
          </Stack>
        </Box>
      </Paper>
      <Paper
        sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1, marginTop: 3 }}
      >
        <h1> Configurações</h1>
        Excluir conta:
        <button onClick={handleOpen}>Excluir</button>
      </Paper>
      <Paper sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1 }}>
        Alterar Senha:
        <Link to={"/updatePassword"}>
          <button>Alterar</button>
        </Link>
      </Paper>

      <ModalConfirm
        action={deleteUser.bind(this, user.id)}
        title="Deseja Excluir sua conta?"
        text={textModal}
        setOpen={open}
        setClose={handleClose}
        infoOne= "Excluir a conta"
      />
    </>
  );
}

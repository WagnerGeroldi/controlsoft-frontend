/* Imports REACT */
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
import VisibilityIcon from "@mui/icons-material/Visibility";

/* Imports Libs */
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { mask } from "remask";

/* Imports CSS */
import "../styles/alert.scss";
import "../styles/Register.scss";
import "react-toastify/dist/ReactToastify.css";

/* Imports Extras */
import { api } from "../../api/api";
import { ButtonDefault } from "../../components/Button";
import {
  getTokenLocalStorage,
  getUserLocalStorage,
  setUserLocalStorage,
} from "../../state/SaveLocalStorage";
import { Head } from "../partials/Head";

/*Interface*/
interface IUser {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthday: string;
  address: string;
  cep: string;
  city: string;
  houseNumber: number;
  country: string;
}

/* Validações */
const validationRegistrerUser = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  email: yup.string().required("Email é obrigatório"),
  cpf: yup.string().min(11, "CPF deve ter 11 dígitos"),
  phone: yup.string(),
  birthday: yup.string(),
  address: yup.string(),
  cep: yup.string(),
  city: yup.string(),
  houseNumber: yup.string(),
  country: yup.string(),
});

export function UpdateUser() {

  const user = getUserLocalStorage();
  const token = getTokenLocalStorage();
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams() as { id: string };
  const [birthday, setBirthday] = useState(user.birthday);
  const [phone, setPhone] = useState(user.phone);
  const [cep, setCep] = useState(user.cep);
  const [cpf, setCpf] = useState(user.cpf);
  const [viaCep, setViaCep] = useState([] as any);
  /*funcoes*/

  const onChangeBirthday = (e: any) => {
    setBirthday(mask(e.target.value, ["99/99/9999"]));
  };

  const onChangePhone = (e: any) => {
    setPhone(mask(e.target.value, ["99 9 9999-9999"]));
  };
  const onChangeCEP = (e: any) => {
    setCep(mask(e.target.value, ["99999-999"]));
  };

  const onChangeCpf = (e: any) => {
    setCpf(mask(e.target.value, ["999.999.999-99"]));
  };

  /*lidar com formulário */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUser>({
    resolver: yupResolver(validationRegistrerUser),
  });

  /* consulta backend */

  useEffect(() => {
    api
      .get(`/users/${id}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        reset(res.data);
      });
  }, []);

  const updateUser = (data: IUser) =>
    api
      .put(`/users/${id}`, data, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setIsLoading(true);
        setUserLocalStorage(data);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/user/config/" + user.id);
        }, 1000);
      })
      .catch((error) => {
        const message =
          error.response.data.message || error.response.data.errors[0].msg;
        toast.error(message);
      });


      async function consultacep(cep: string) {
        let newCEP = cep.replace(/\D/g, "");
    
        await fetch(`http://viacep.com.br/ws/${newCEP}/json/`).then((response) => {
          response.json().then((data) => setViaCep(data));
        });
      }

    
  return (
    <>
      <Head
    title= "ControlSoft - Atualizar Usuário"
    />
      <div className="container">
        <Card sx={{ maxWidth: 875 }}>
          <ToastContainer />
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              <i className="fa fa-wrench fa-2x" aria-hidden="true"></i>{" "}
              Atualizar dados do Usuário
            </Typography>
            <br />
            <p>Atualize seus dados!</p>
            <Paper sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1 }}>
              <Box
                onSubmit={handleSubmit(updateUser)}
                component="form"
                sx={{ flexGrow: 1 }}
                noValidate
                autoComplete="off"
              >
                <Grid container spacing={2}>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="name"
                      label="Nome Completo"
                      {...register("name")}
                      variant="outlined"
                      fullWidth
                      type="text"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <p className="error-message">{errors.name?.message}</p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="email"
                      label="Email"
                      {...register("email")}
                      variant="outlined"
                      fullWidth
                      type="email"
                      disabled
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <small className="error-message">
                      O email não pode ser alterado
                    </small>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                      <TextField
                        id="cpf"
                        {...register("cpf")}
                        label="CPF"
                        size="small"
                        fullWidth
                        onChange={onChangeCpf}
                        value={cpf}
                        placeholder="000.000.000-00"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                    <p className="error-message">{errors.cpf?.message}</p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="birthday"
                      {...register("birthday")}
                      label="Data de nascimento"
                      onChange={onChangeBirthday}
                      value={birthday}
                      variant="outlined"
                      fullWidth
                      placeholder="12/12/2000"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <p className="error-message">{errors.birthday?.message}</p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="phone"
                      {...register("phone")}
                      label="Telefone"
                      size="small"
                      onChange={onChangePhone}
                      value={phone}
                      fullWidth
                      placeholder="(54) 9 9933-3399"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <p className="error-message">{errors.phone?.message}</p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="address"
                      {...register("address")}
                      label="Endereço"
                      size="small"
                      fullWidth
                      placeholder="Rua Elizio Postali"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <p className="error-message">{errors.address?.message}</p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="houseNumber"
                      {...register("houseNumber")}
                      label="Número"
                      size="small"
                      type="number"
                      fullWidth
                      placeholder="Exe: 50"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <p className="error-message">
                      {errors.houseNumber?.message}
                    </p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="cep"
                      {...register("cep")}
                      label="CEP"
                      size="small"
                      onChange={onChangeCEP}
                     
                      value={cep}
                      fullWidth
                      placeholder="99250-000"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <p className="error-message">{errors.cep?.message}</p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="city"
                      {...register("city")}
                      label="Cidade"
                      size="small"
                      fullWidth
                      onFocus={() => consultacep(cep)}
                      value={!viaCep.localidade ? "" : viaCep.localidade}
                      placeholder="São Paulo"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <p className="error-message">{errors.city?.message}</p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="country"
                      {...register("country")}
                      label="Estado"
                      size="small"
                      fullWidth
                      value={!viaCep.uf ? "" : viaCep.uf}
                      placeholder="Rio Grande do Sul"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <p className="error-message">{errors.country?.message}</p>
                  </Grid>
                </Grid>
                <ButtonDefault
                  link={`/user/config/${user.id}`}
                  contentBtnPrimary={isLoading ? "Aguarde..." : "Salvar"}
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

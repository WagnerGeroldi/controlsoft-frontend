/* Imports REACT */
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
  MenuItem,
} from "@mui/material";

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

/*Interface*/
interface IClientRegister {
  name: string;
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
  cpf: yup
    .string()
    .required("O CPF é obrigatório")
    .min(11, "CPF deve ter 11 dígitos"),
  phone: yup.string().required("Telefone é obrigatório"),
  birthday: yup.string().required("Data de nascimento é obrigatório"),
  address: yup.string().required("Endereço é obrigatório"),
  cep: yup.string().required("CEP é obrigatório"),
  city: yup.string().required("Cidade é obrigatório"),
  houseNumber: yup.string().required("Número é obrigatório"),
  country: yup.string().required("Estado é obrigatório"),
});

export function CreateClient() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams() as { id: string };
  const [cpf, setCpf] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [viaCep, setViaCep] = useState([] as any);

  /*funcoes*/
  const onChangeCpf = (e: any) => {
    setCpf(mask(e.target.value, ["999.999.999-99"]));
  };
  const onChangeBirthday = (e: any) => {
    setBirthday(mask(e.target.value, ["99/99/9999"]));
  };

  const onChangePhone = (e: any) => {
    setPhone(mask(e.target.value, ["99 9 9999-9999"]));
  };
  const onChangeCEP = (e: any) => {
    setCep(mask(e.target.value, ["99999-999"]));
  };

  /*lidar com formulário */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IClientRegister>({
    resolver: yupResolver(validationRegistrerUser),
  });

  /* consulta backend */
  const registerClient = (data: IClientRegister) =>
    api
      .post(`/clients/${id}`, data)
      .then((res) => {
        setIsLoading(true);
        toast.success("Cliente cadastrado!");
        setTimeout(() => {
          navigate("/clients/" + id);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);

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
      <div className="container">
        <Card sx={{ maxWidth: 875 }}>
          <ToastContainer />
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              <i className="fa fa-user-plus fa-2x" aria-hidden="true"></i>{" "}
              Cadastre seu Cliente
            </Typography>
            <br />
            <p>
              Cadastre todos os dados do cliente, após o cadastro você poderá
              incluir débitos a ele!
            </p>
            <Paper sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1 }}>
              <Box
                onSubmit={handleSubmit(registerClient)}
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
                      type="text"
                      placeholder="Exe: João da Silva"
                      size="small"
                    />
                    <p className="error-message">{errors.name?.message}</p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="cpf"
                      {...register("cpf")}
                      onChange={onChangeCpf}
                      value={cpf}
                      label="CPF"
                      size="small"
                      fullWidth
                      placeholder="000.000.000-00"
                      variant="outlined"
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
                    />
                    <p className="error-message">{errors.cep?.message}</p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="city"
                      {...register("city")}
                      label="Cidade"
                      size="small"
                      onFocus={() => consultacep(cep)}
                      fullWidth
                      value={!viaCep.localidade ? "" : viaCep.localidade}
                      placeholder="São Paulo"
                      variant="outlined"
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
                    >
                    </TextField>
                    <p className="error-message">{errors.country?.message}</p>
                  </Grid>
                </Grid>
                <ButtonDefault
                  link={`/clients/${id}`}
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

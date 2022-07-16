/* Imports REACT */
import { useNavigate, useParams } from "react-router-dom";
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
interface IProductRegister {
  name: string;
  description: string;
  quantity: string;
  value: string;
}

/* Validações */
const validationRegistrerUser = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  description: yup.string(),
  quantity: yup.string().required("Quantidade é obrigatório"),
  value: yup.string().required("Valor é obrigatório"),
});

export function CreateProduct() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams() as { id: string };
  const [value, setValue] = useState("");

  /*funcoes*/

  const onChangeValue = (e: any) => {
    setValue(mask( e.target.value, ["9,999","99,999", "999,999", "9.999,999", "99.999,99", "999.999,99"]));
  };

  /*lidar com formulário */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProductRegister>({
    resolver: yupResolver(validationRegistrerUser),
  });

  /* consulta backend */
  const registerClient = (data: IProductRegister) =>
    api
      .post(`/products/${id}`, data)
      .then((res) => {
        setIsLoading(true);
        toast.success("Produto cadastrado!");
        setTimeout(() => {
          navigate("/products/" + id);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);

        const message =
          error.response.data.message || error.response.data.errors[0].msg;
        toast.error(message);
      });

  return (
    <>
      <div className="container">
        <Card sx={{ maxWidth: 875 }}>
          <ToastContainer />
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              <i className="fa fa-user-plus fa-2x" aria-hidden="true"></i>{" "}
              Cadastro de produtos
            </Typography>
            <br />
            <p>Cadastre seus produtos, depois poderá usá-los em suas vendas!</p>
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
                      label="Nome"
                      variant="outlined"
                      fullWidth
                      type="text"
                      placeholder="Exe: Coca-cola 2L"
                      size="small"
                    />
                    <p className="error-message">{errors.name?.message}</p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="description"
                      {...register("description")}
                      label="Descrição"
                      size="small"
                      fullWidth
                      variant="outlined"
                    />
                    <p className="error-message">
                      {errors.description?.message}
                    </p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="value"
                      {...register("value")}
                      label="Valor"
                      onChange={onChangeValue}
                      value={value}
                      variant="outlined"
                      fullWidth
                      placeholder="R$ 9,99"
                      size="small"
                    />
                    <p className="error-message">{errors.value?.message}</p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="phone"
                      {...register("quantity")}
                      label="Quantidade"
                      size="small"
                      fullWidth
                      placeholder="exe: 10"
                      variant="outlined"
                    />
                    <p className="error-message">{errors.quantity?.message}</p>
                  </Grid>
                </Grid>
                <ButtonDefault
                  link={`/products/${id}`}
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

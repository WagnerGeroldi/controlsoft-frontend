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

/*Interface*/
interface IUser {
  name: string;
  description: string;
  quantity: string;
  value: string;
  createdAt: string;
}

/* Validações */
const validationRegistrerUser = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  description: yup.string(),
  quantity: yup.string().required("A quantidade é obrigatória"),
  value: yup.string().required("O valor é obrigatório"),
});

export function UpdateProduct() {

  const user = getUserLocalStorage();
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams() as { id: string };
  const [price, setPrice] = useState();

  /*funcoes*/


  const onChangePrice = (e: any) => {
    setPrice(mask(e.target.value, ["9,999","99,999", "999,999", "9.999,999", "99.999,99", "999.999,99"]));
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
      .get(`/products/details/${id}`)
      .then((res) => {
        reset(res.data);
      });
  }, []);

  const updateProduct = (data: IUser) =>
    api
      .put(`/products/${id}`, data)
      .then((res) => {
        setIsLoading(true);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/products/" + user.id);
        }, 1000);
      })
      .catch((error) => {
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
              <i className="fa fa-wrench fa-2x" aria-hidden="true"></i>{" "}
              Atualizar produto
            </Typography>
            <br />
            <p>Atualize os dados do produto!</p>
            <Paper sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1 }}>
              <Box
                onSubmit={handleSubmit(updateProduct)}
                component="form"
                sx={{ flexGrow: 1 }}
                noValidate
                autoComplete="off"
              >
                <Grid container spacing={2}>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="name"
                      label="Nome"
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
                      id="createdAt"
                      label="Data do Cadastro"
                      {...register("createdAt")}
                      variant="outlined"
                      fullWidth
                      disabled
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="description"
                      label="Descrição"
                      {...register("description")}
                      variant="outlined"
                      fullWidth
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                      <TextField
                        id="quantity"
                        {...register("quantity")}
                        label="Quantidade"
                        size="small"
                        fullWidth
                        placeholder="Exe: 2"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                    <p className="error-message">{errors.quantity?.message}</p>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="value"
                      {...register("value")}
                      label="Preço"
                      onChange={onChangePrice}
                      value={price}
                      variant="outlined"
                      fullWidth
                      placeholder="Exe: 10,00"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <p className="error-message">{errors.value?.message}</p>
                  </Grid>
                </Grid>
                <ButtonDefault
                  link={`/products/${user.id}`}
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

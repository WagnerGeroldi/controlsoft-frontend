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
  MenuItem,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

/* Imports Libs */
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

/* Imports CSS */
import "../styles/alert.scss";
import "../styles/NewSale.scss";
import "react-toastify/dist/ReactToastify.css";

/* Imports Extras */
import { api } from "../../api/api";
import { getUserLocalStorage } from "../../state/SaveLocalStorage";

/*import de componentes */
import { ModalCancelSale } from "../../components/Modals/ModalCancelSale";
import { ModalConfirm } from "../../components/Modals/ModalConfirm";
import { ModalClearList } from "../../components/Modals/ModalClearList";
import { Header } from "../partials/Header";
import { Head } from "../partials/Head";

/* Validações */
const validationRegistrerUser = yup.object().shape({
  product: yup.object().required("O produto é obrigatório"),
  quantity: yup.string().required("A quantidade é obrigatória"),
});

const values = [
  {
    id: "1",
    value: 1,
  },
  {
    id: "2",
    value: 2,
  },
  {
    id: "3",
    value: 3,
  },
  {
    id: "4",
    value: 4,
  },
  {
    id: "5",
    value: 5,
  },
  {
    id: "6",
    value: 6,
  },
  {
    id: "7",
    value: 7,
  },
];

export function NewSale() {
  let navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams() as { id: string };
  const user = getUserLocalStorage();

  const [client, setClient] = useState({} as any);
  const [products, setProducts] = useState([] as any);

  const [order, setOrder] = useState([] as any);

  const [captureIdItem, setCaptureIdItem] = useState();
  const [captureIdClient, setCaptureIdClient] = useState();

  const [open, setOpen] = useState(false);
  const [openModalClearList, setOpenModalClearList] = useState(false);
  const [openModalRegisterSale, setOpenModalRegisterSale] = useState(false);
  const [openModalCancelSale, setOpenModalCancelSale] = useState(false);

  const handleClose = () => setOpen(false);
  const handleCloseModalClearList = () => setOpenModalClearList(false);
  const handleCloseModalCancelSale = () => setOpenModalCancelSale(false);
  const handleCloseModalRegisterSale = () => setOpenModalRegisterSale(false);

  const handleClickOpen = (id: any) => {
    setCaptureIdItem(id);
    setOpen(true);
  };

  const handleClickOpenModalClearList = (id: any) => {
    setCaptureIdClient(id);
    setOpenModalClearList(true);
  };

  const handleClickOpenModalCancelSale = (id: any) => {
    setCaptureIdClient(id);
    setOpenModalCancelSale(true);
  };

  const handleClickOpenModalRegisterSale = (id: any) => {
    setCaptureIdClient(id);
    setOpenModalRegisterSale(true);
  };

  /*lidar com formulário */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationRegistrerUser),
  });

  /* consulta backend */

  useEffect(() => {
    api.get("/clients/details/" + id).then((res) => {
      setClient(res.data);
    });
  }, []);

  useEffect(() => {
    api
      .get("/products/" + user.id)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    api
      .get(`/order/${id}`)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  const registerSale = () => {
    api
      .post(`/sale/${id}`, order, user.id)
      .then((res) => {
        setIsLoading(true);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/clients/" + user.id);
        }, 1000);
      })
      .catch((error) => {
        const message =
          error.response.data.message || error.response.data.errors[0].msg;
        toast.error(message);
      });
  }

  const addItem = (data: any) =>
    api
      .post(`/order/${id}`, data)
      .then((response) => {
        toast.success(response.data.message);
        setOrder(response.data.allOrder);
      })
      .catch((error) => {
        const message =
          error.response.data.message || error.response.data.errors[0].msg;
        toast.error(message);
      });

  async function clearList(client_ID: any) {
    await api
      .delete("order/clearList/" + client_ID)
      .then((res) => {
        const message = res.data.message;
        toast.success(message);
        setOrder([]);
      })
      .catch((error) => {
        switch (error.response.status) {
          case 404:
            toast.error(error.response.data.message);
            break;
          default:
            toast.error("Houve um erro, tente novamente");
        }
      });

    handleCloseModalClearList();
  }

  async function deleteItem(id: string) {
    await api
      .delete("order/" + id)
      .then((res) => {
        const message = res.data.message;
        toast.success(message);
        const newOrders = order.filter((item: any) => item.id !== id);
        setOrder(newOrders);
      })
      .catch(() => {
        toast.error("Houve um erro, tente novamente");
      });

    handleClose();
  }

  return (
    <>
      <Head
    title= "ControlSoft - Nova Venda"
    />
    <Header />
      <div className="container">
        <Card sx={{ maxWidth: 1100 }}>
          <ToastContainer />
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              <i className="fa fa-shopping-cart fa-2x" aria-hidden="true"></i>{" "}
              Nova venda
            </Typography>
            <br />
            <div className="d-flex gap-5 p-3 align-items-center justify-content-between">
              <p>Informe os produtos e a quantidade</p>
              <table>
                <tr className="d-flex gap-2">
                  <td>Cliente:</td>
                  <td>
                    <strong>{client.name}</strong>
                  </td>
                </tr>
              </table>
            </div>
            <Paper sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1 }}>
              <Box
                onSubmit={handleSubmit(addItem)}
                component="form"
                sx={{ flexGrow: 1 }}
                noValidate
                autoComplete="off"
              >
                <Grid container spacing={2}>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      {...register("product")}
                      name="product"
                      id="product"
                      fullWidth
                      size="small"
                      select
                      label="Produto"
                    >
                      {products.map((product: any) => (
                        <MenuItem key={product.id} value={product}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <p className="error-message">{errors.product?.message}</p>
                  </Grid>
                  <Grid item lg={3} md={3} xs={12}>
                    <TextField
                      id="quantity"
                      {...register("quantity")}
                      name="quantity"
                      label="Quantidade"
                      size="small"
                      select
                      fullWidth
                      type="number"
                      placeholder="1"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      {values.map((item: any) => (
                        <MenuItem key={item.id} value={item.value}>
                          {item.value}
                        </MenuItem>
                      ))}
                    </TextField>
                    <p className="error-message">{errors.quantity?.message}</p>
                  </Grid>
                  <Grid item lg={3} md={3} xs={12}>
                    <Button variant="contained" type="submit">
                      Adicionar
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </CardContent>
        </Card>
        <Card sx={{ maxWidth: 875, minWidth: 645 }}>
          <CardContent>
            <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
              <i className="fa fa-info " aria-hidden="true"></i> Resumo do
              pedido
            </Typography>
            <Paper sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1 }}>
              <table className="w-100 mb-5 text-center table-map">
                <tr>
                  <td>Produto</td>
                  <td>Preço Unitário</td>
                  <td>Quantidade</td>
                  <td>Total</td>
                  <td>Excluir</td>
                </tr>
                {order.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.product}</td>
                    <td>R$ {item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>R$ {item.total.toFixed(2)}</td>
                    <td>
                      <DeleteIcon
                        className="icon-delete"
                        onClick={() => handleClickOpen(item.id)}
                      />
                    </td>
                  </tr>
                  ))}                
              </table>
              <Box
                component="form"
                sx={{ flexGrow: 1 }}
                noValidate
                autoComplete="off"
              >
                <Grid container spacing={2}></Grid>
                <div className="d-flex align-items-center justify-content-between">
                  <Button
                    onClick={() => handleClickOpenModalRegisterSale(id)}
                    variant="contained"
                    color="primary"
                  >
                    Registrar venda
                  </Button>
                  <Button
                    onClick={() => handleClickOpenModalCancelSale(id)}
                    variant="contained"
                    color="secondary"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => handleClickOpenModalClearList(id)}
                    variant="contained"
                    color="warning"
                  >
                    Limpar tudo
                  </Button>
                </div>
              </Box>
            </Paper>
          </CardContent>
        </Card>
      </div>

      <ModalConfirm
        action={deleteItem.bind(this, captureIdItem)}
        title="Deseja excluir este item?"
        setOpen={open}
        setClose={handleClose}
        infoOne="Excluir"
      />

      <ModalClearList
        action={clearList.bind(this, captureIdClient)}
        title="Tem certeza que deseja Limpar a lista?"
        setOpen={openModalClearList}
        setClose={handleCloseModalClearList}
        infoOne="Limpar lista"
      />

      <ModalCancelSale
        action={clearList.bind(this, captureIdClient)}
        title="Ao sair da venda, sua lista será perdida, deseja continuar?"
        setOpen={openModalCancelSale}
        link={`/clients/${user.id}`}
        setClose={handleCloseModalCancelSale}
        infoOne="Continuar"
      />

      <ModalCancelSale
        action={registerSale}
        title="Confirmar venda?"
        setOpen={openModalRegisterSale}
        link={`/clients/${user.id}`}
        setClose={handleCloseModalRegisterSale}
        infoOne="REGISTRAR"
      />
    </>
  );
}

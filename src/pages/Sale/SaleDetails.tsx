/*imports react */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/*imports libs */
import { ToastContainer, toast } from "react-toastify";

/*imports extras */
import { api } from "../../api/api";
import { Header } from "../partials/Header";

/*imports styles CSS */
import "react-toastify/dist/ReactToastify.css";
import "./SaleDetails.scss";

/*imports MUI */
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";

/* imports extras */
import { ModalConfirm } from "../../components/Modals/ModalConfirm";
import { HandleOnlyDate } from "../../services/HandleOnlyDate";
import { Head } from "../partials/Head";

export function SaleDetails(this: any) {
  const { id } = useParams() as { id: string };

  const navigate = useNavigate();

  const [dataSale, setDataSale] = useState([] as any);

  const [openPaid, setOpenPaid] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleClosePaid = () => setOpenPaid(false);

  
  const handleClickOpenPaid = () => {
    setOpenPaid(true);  
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  /*Consultas BACKEND */
  useEffect(() => {
    const aux = () => {
      api
        .get("/sale/sale/" + id)
        .then((res) => {
          setDataSale(res.data);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    };
    aux();
  }, []);

  async function deleteSale(id: string) {
    await api
      .delete(`sale/${id}`)
      .then((res) => {
        const message = res.data.message;
        toast.success(message);
        setTimeout(() => {
          navigate(`/clients/${dataSale.user_ID}`);
        }, 600);
      })
      .catch(() => {
        toast.error("Houve um erro, tente novamente");
      });

    handleClose();
  }

  async function paidSale(id: string) {
    await api
      .put(`sale/${id}`)
      .then((res) => {
        const message = res.data.message;
        toast.success(message);
        setTimeout(() => {
          navigate(`/clients/${dataSale.user_ID}`);
        }, 600);
      })
      .catch(() => {
        toast.error("Houve um erro, tente novamente");
      });

    handleClose();
  }

  return (
    <>
      <Head title="ControlSoft - Detalhes da venda" />
      <Header />
      <ToastContainer />

      <Paper
        sx={{
          p: 2,
          margin: "auto",
          maxWidth: 1100,
          flexGrow: 1,
          marginTop: 3,
        }}
      >
        <div className="info-user">
          <h1> Detalhes da venda </h1>
        </div>
        <div className="d-flex justify-content-around align-items-center">
          <table className="table">
            <tr>
              <td className="index-info">Data da Compra:</td>{" "}
              <td>
                <strong>{HandleOnlyDate(new Date(dataSale.createdAt))}</strong>
              </td>
            </tr>
            <tr>
              <td className="index-info">Produto:</td>{" "}
              <td>
                <strong>{dataSale.product}</strong>
              </td>
            </tr>
            <tr>
              <td className="index-info">Descrição:</td>{" "}
              <td>
                <strong>{dataSale.description}</strong>
              </td>
            </tr>
            <tr>
              <td className="index-info">Preço:</td>{" "}
              <td>
                <strong>R$ {parseFloat(dataSale.price).toFixed(2)}</strong>
              </td>
            </tr>
            <tr>
              <td className="index-info">Quantidade:</td>{" "}
              <td>
                <strong>{dataSale.quantity}</strong>
              </td>
            </tr>
            <tr>
              <td className="index-info">Valor total:</td>{" "}
              <td>
                <strong>
                  R$ {parseFloat(dataSale.totalProduct).toFixed(2)}
                </strong>
              </td>
            </tr>
            <tr>
              <td className="index-info">Data do vencimento:</td>{" "}
              <td>
                <strong>{HandleOnlyDate(new Date(dataSale.dueData))}</strong>
              </td>
            </tr>
          </table>

          <div className="d-flex gap-2 flex-column">
            <Button
            onClick={() => handleClickOpenPaid()}
            variant="contained" color="primary">
              Quitar a venda
            </Button>

            <Button variant="contained" color="secondary">
              Imprimir
            </Button>

            <Button
              onClick={() => handleClickOpen()}
              variant="contained"
              color="warning"
            >
              Excluir a venda
            </Button>
          </div>
        </div>
      </Paper>

      <ModalConfirm
        action={deleteSale.bind(this, id)}
        title="Deseja excluir esta venda?"
        setOpen={open}
        setClose={handleClose}
        infoOne="Excluir"
      />

      <ModalConfirm
        action={paidSale.bind(this, id)}
        title="Deseja quitar esta venda?"
        setOpen={openPaid}
        setClose={handleClosePaid}
        infoOne="Quitar"
      />
    </>
  );
}

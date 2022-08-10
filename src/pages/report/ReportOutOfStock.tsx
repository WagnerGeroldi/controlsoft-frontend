/*imports react */
import { useParams, useSearchParams } from "react-router-dom";

/*imports extras */
import { Header } from "../partials/Header";
import { HandleOnlyDate } from "../../services/HandleOnlyDate";
import { Head } from "../partials/Head";

/*imports styles CSS */
import "./ReportTotalStock.scss";
import "react-toastify/dist/ReactToastify.css";

/*imports MUI */
import Paper from "@mui/material/Paper";
import { Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../../api/api";
import { ReportPDFOutByDate } from "./PDF/ReportPDFOutByDate";
import { getTokenLocalStorage } from "../../state/SaveLocalStorage";


export function ReportOutOfStock() {
  const [outByDate, setOutByDate] = useState([] as any);
  const [searchParams] = useSearchParams();
  const token = getTokenLocalStorage();
  const initialDate: any = searchParams.get("initialDate");
  const finalDate: any = searchParams.get("finalDate");
  const idQuery: any = searchParams.get("id");
 

  useEffect(() => {
    api
      .get(`/outOfStock/findByDate/?id=${idQuery}&initialDate=${initialDate}&finalDate=${finalDate}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setOutByDate(res.data)
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  return (
    <>
      <Head title="Rede Unisoft - Relatório de Baixas" />
      <Header />
      <ToastContainer />
      <div className="p-3">
        <Paper
          sx={{
            p: 2,
            margin: "auto",
            maxWidth: 1100,
            flexGrow: 1,
            marginTop: 3,
          }}
        >
          <Button
            onClick={(e) => ReportPDFOutByDate(outByDate, initialDate, finalDate)}
            variant="contained"
            color="primary"
          >
            Gerar PDF
          </Button>
          <Link to={`/report/${idQuery}`}>
            <Button>Voltar</Button>
          </Link>
          <div className="info-user">
            <h2>{`Relatório de Saídas de ${searchParams.get("initialDate")} até ${searchParams.get("finalDate")} `}</h2>
          </div>
          <Grid container spacing={2} className="div-table">
            <Grid item xs={12}>
                <table className="table table-striped">
                <thead>
                  <tr>
                    <td>Produto</td>
                    <td>Quantidade</td>
                    <td>Data da Baixa</td>
                  </tr>
                </thead>
                <tbody>
                  {outByDate.map((item: any) => (
                    <tr key={item.id}>
                      <td>{item.product}</td>
                      <td>{item.quantity}</td>
                      <td>{HandleOnlyDate(new Date(item.updatedAt))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </>
  );
}

import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Header } from "./partials/Header";
import "./styles/Dashboard.scss";

import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../api/api";

import useAuth from "../state/Auth";
import { Head } from "./partials/Head";

export function Dashboard() {
  const { id } = useParams() as { id: string };
  const [clients, setClients] = useState();
  const [products, setProducts] = useState();
  const [sumTotal, setSumTotal] = useState(0);
  const [sumProductsTotal, setSumProductsTotal] = useState(0);

  useEffect(() => {
    api
      .get("/clients/countClient/" + id)
      .then((res) => {
        setClients(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    api
      .get("/sale/sumTotalSales/" + id)
      .then((res) => {
        setSumTotal(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    api
      .get("/products/countProducts/" + id)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    api
      .get("/products/sumTotalProducts/" + id)
      .then((res) => {
        setSumProductsTotal(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  const { user }: any = useAuth();

  return (
    <>
      <Head title="ControlSoft - Dashboard" />
      <Header />
      <div id="home" className="container-fluid">
        <div className="row col-12 mt-4 text-center m-0">
          <p className="bg-light border border-dark p-4 fs-1">DASHBOARD</p>
        </div>
        <div className="content-dashboard">
          <div className="row bg-light border border-dark p-4 m-0 text-justify">
            Bem vindo ao CONTROL SOFT, aqui seus clientes poderão ser geridos
            com facilidade e segurança. <br />
            Mantenha controle total, cadastre seu clientes, controle seus
            pagamentos, débitos e tudo aquilo que realmente é necessário para
            que consiga lidar bem com seus negócios. <br />
            Antes de usar o sistema, acesse nossa documentação para aprender os
            mecanismos de funcionamento.
            <Link to="#">CLIQUE AQUI</Link>
            Abaixo segue um resumo de como anda a situação de seus clientes,
            produtos e financeiro. <br />
            Caso quiser personalizar os cards do dashboard, acesse as
            configurações do sistema.
          </div>

          <Grid container alignContent="center" spacing={2} className="mt-4">
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Link to={`/clients/${id}`}>
                <Card
                  sx={{
                    maxWidth: 275,
                    minWidth: 200,
                    textAlign: "center",
                    background: "blue",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Typography sx={{ fontSize: 18 }} gutterBottom>
                      Clientes cadastrados
                    </Typography>
                    <Typography variant="h4" component="div">
                      {clients}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Link to={`/products/${id}`}>
                <Card
                  sx={{
                    maxWidth: 275,
                    minWidth: 200,
                    textAlign: "center",
                    background: "green",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Typography sx={{ fontSize: 18 }} gutterBottom>
                      Produtos cadastrados
                    </Typography>
                    <Typography variant="h4" component="div">
                      {products}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Link to="#">
                <Card
                  sx={{
                    maxWidth: 275,
                    minWidth: 200,
                    textAlign: "center",
                    background: "darkblue",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Typography sx={{ fontSize: 18 }} gutterBottom>
                      Total a receber
                    </Typography>
                    <Typography variant="h4" component="div">
                      R$ {sumTotal.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Link to="#">
                <Card
                  sx={{
                    minWidth: 200,
                    maxWidth: 275,
                    textAlign: "center",
                    background: "orange",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Typography sx={{ fontSize: 18 }} gutterBottom>
                      Patrimônio em estoque
                    </Typography>
                    <Typography variant="h4" component="div">
                      R$ {sumProductsTotal.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}

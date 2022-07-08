import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Header } from "./partials/Header";
import "./styles/Dashboard.scss";

import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <>
      <Header />
      <div id="home" className="container-fluid">
        <div className="row col-12 mt-4 text-center m-0">
          <p className="bg-light border border-dark p-4 fs-1">DASHBOARD</p>
        </div>
        <h1 className="h1">
          EM CONSTRUÇÃO
        </h1>
        <div className="content-dashboard">
          <div className="row bg-light border border-dark p-4 m-0 text-justify">
            Bem vindo ao CONTROL SOFT, aqui seus clientes poderão ser gerido com
            facilidade e segurança. <br />
            Mantenha controle total, cadastre seu clientes, controle seus
            pagamentos, débitos e tudo aquilo que você achar necessário para que
            consiga lidar bem com seus negócios. <br />
            Antes de usar o sistema, acesse nossa documentação para aprender os
            mecanismos de funcionamento.
            <Link to="#">CLIQUE AQUI</Link>
            Abaixo segue um resumo de como anda a situação de seus clientes e
            valores.
          </div>

          <Grid container alignContent="center" spacing={2} className="mt-4">
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Link to="#">
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
                    <Typography variant="h2" component="div">
                      {"1"}
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
                    background: "green",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Typography sx={{ fontSize: 18 }} gutterBottom>
                      Valores a receber
                    </Typography>
                    <Typography variant="h2" component="div">
                      {"2"}
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
                      Pagamentos em aberto
                    </Typography>
                    <Typography variant="h2" component="div">
                      {"3"}
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
                      Solic. pendentes
                    </Typography>
                    <Typography variant="h2" component="div">
                      3
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

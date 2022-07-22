import { Link } from "react-router-dom";
import "../pages/styles/Initial.scss";

/*imports MUI */

import { Box, Container, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import { Head } from "./partials/Head";

export function Initial() {
  return (
    <>
      <Head title="ControlSoft - Controle de Clientes" />
      <header className="header-initial">
        <div>
          <span className="color-c">Control</span>
          <span className="color-s">Soft</span>
          <span className="text"> - Seu sistema de controle de Clientes</span>
        </div>
      </header>
      <div className="header-client">
        <p>Ja é usuário?</p>
        <Link to="/login">
          <Button variant="contained" color="primary">
            Clique para fazer login
          </Button>
        </Link>
      </div>
      <Container maxWidth="lg">
        <Box sx={{ height: "100%" }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item sm={6} xs={12}>
              <div className="box-content">
                <h2> Quem somos?</h2>A StartSoft tecnologia é uma empresa do
                ramo de desenvolvimento de software, fundada em 2022 com o
                intuito de criar soluções para os problemas do dia a dia das
                pessoas, o ControlSoft é um sistema de gerenciamento de
                clientes, pensado para aquelas pessoas que possuem uma atividade
                extra, como vendendores de costméticos entre outros, que
                precisam controlar o financeiro de seus clientes.
              </div>
            </Grid>
            <Grid item sm={6} xs={12}>
              <div className="box-content">
                aqui vai um vídeo do sistema funcionando <br />
              </div>
            </Grid>
            <Grid item sm={6} xs={12}>
              <div className="box-content">
                Controle financeiro total de seus clientes, com o ControlSoft,
                você poderá cadastrar o débitos de seus clintes, gerar um
                extrato, criar limites de compra, enviar mensagens ou emails de
                lembrete entre outras funcionalidades exclusivas.
                <p>
                  <br />
                  <Link to="/register">
                    <Button variant="contained" color="primary">
                      Crie sua conta e começe agora
                    </Button>
                  </Link>
                </p>
              </div>
            </Grid>
            <Grid item sm={6} xs={12}>
              <div className="box-content">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
                ullam magni nisi sit aliquid ab laborum delectus expedita
                inventore atque? Sunt, ipsa aspernatur. Sapiente quia mollitia
                voluptatibus tempore, numquam sint.
              </div>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <footer className="footer-initial">
        MAPA DO SITE, LINKS... ACESSOS, INFORMAÇÕES DA EMPRESA E TAL
      </footer>
    </>
  );
}

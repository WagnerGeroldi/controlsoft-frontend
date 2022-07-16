/*imports react */
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

/*imports libs */
import { ToastContainer, toast } from "react-toastify";
import DataTable from "react-data-table-component";

/*imports extras */
import { api } from "../../api/api";
import { Header } from "../partials/Header";
import { getUserLocalStorage } from "../../state/SaveLocalStorage";

/*imports styles CSS */

import "react-toastify/dist/ReactToastify.css";

/*imports MUI */
import Paper from "@mui/material/Paper";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { ModalConfirm } from "../../components/Modals/ModalConfirm";

const FilterComponent = ({ filterText, onFilter, onClear }: any) => (
  <>
    <input
      id="search"
      type="text"
      placeholder="Pesquisar..."
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <Button id="button" className="bg-primary text-white" type="button" onClick={onClear}>
      X
    </Button>
  </>
);

const textModal = "Deseja apagar este cliente?";

export function Clients(this: any) {
  const { id } = useParams() as { id: string };
  const { user, token } = getUserLocalStorage();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const [clients, setClients] = useState([]);

  const [idClient, setIdClient] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClickOpen = (id: string) => {
    setIdClient(id);
    setOpen(true);
  };

  /*Consultas BACKEND */
  useEffect(() => {
    api
      .get("/clients/" + id)
      .then((res) => {
        setClients(res.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  async function deleteClient(id: string) {
    await api
      .delete("clients/" + id)
      .then((res) => {
        const message = res.data.message;
        toast.success(message);
        const newCLients = clients.filter((client: any) => client.id !== id);
        setClients(newCLients);
      })
      .catch(() => {
        toast.error("Houve um erro, tente novamente");
      });

    handleClose();
  }

  function updateClient(id: number) {
    navigate(`/clients/updateClient/${id}`);
  }

  function handleNewSale(id: number) {
    navigate(`/sale/newSale/${id}`);
  }

    /*lidar com filtro da lista */
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const filteredItems = clients.filter(
      (item: any) =>
        item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
    );

    const subHeaderComponentMemo = useMemo(() => {
      const handleClear = () => {
        if (filterText) {
          setResetPaginationToggle(!resetPaginationToggle);
          setFilterText("");
        }
      };

      return (
        <FilterComponent
          onFilter={(e: any) => setFilterText(e.target.value)}
          onClear={handleClear}
          filterText={filterText}
        />
      );
    }, [filterText, resetPaginationToggle]);

    /*fim lidar com filtro da lista */

    /*criando colunas datatable */

    const columns = [
      {
        name: "Nome",
        selector: (row: any) => row.name,
        sortable: true,
      },
      {
        name: "Telefone",
        selector: (row: any) => row.phone,
        sortable: true,
      },
      {
        name: "Valor em Aberto",
        selector: (row: any) => !row.balance ? "Sem débitos" : "R$ " + row.balance,
        sortable: true,
      },
      {
        cell: (row: any) => (
          <IconButton
            aria-label="update"
            size="large"
            onClick={updateClient.bind(this, row.id)}
          >
            <EditIcon />
          </IconButton>
        ),
        allowOverflow: true,
        button: true,
        width: "56px",
      },
      {
        cell: (row: any) => (
          <IconButton
            aria-label="delete"
            size="large"
            onClick={() => handleClickOpen(row.id)}
          >
            <DeleteIcon />
          </IconButton>
        ),
        allowOverflow: true,
        button: true,
        width: "56px",
      },
      {
        cell: (row: any) => (
          <IconButton
            aria-label="add"
            size="large"
            onClick={handleNewSale.bind(this, row.id)}
          >
            <AddIcon />
          </IconButton>
        ),
        allowOverflow: true,
        button: true,
        width: "56px",
      }
    ];

    return (
      <>
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
          <Link to={`/clients/createClient/${id}`}>
            <Button variant="contained" color="success" startIcon={<AddIcon />}>
              Cadastrar Cliente
            </Button>
          </Link>
          <div className="info-user">
            <h1> Clientes </h1>
          </div>

          {loading === true ? (
            <p className="loading">Carregando informações...</p>
          ) : (
            <DataTable
              columns={columns}
              data={filteredItems}
              pagination
              paginationResetDefaultPage={resetPaginationToggle}
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              persistTableHead
              dense
            />
          )}
        </Paper>
        <ModalConfirm
          action={deleteClient.bind(this, idClient)}
          title="Deseja excluir este cliente?"
          setOpen={open}
          setClose={handleClose}
          infoOne="Excluir"
        />
      </>
    );
  }

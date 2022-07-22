/*imports react */
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

/*imports libs */
import { ToastContainer, toast } from "react-toastify";
import DataTable, { ExpanderComponentProps } from "react-data-table-component";

/*imports extras */
import { api } from "../../api/api";
import { Header } from "../partials/Header";

/*imports styles CSS */
import "./Clients.scss";
import "react-toastify/dist/ReactToastify.css";

/*imports MUI */
import Paper from "@mui/material/Paper";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";


/* imports extras */
import { ModalConfirm } from "../../components/Modals/ModalConfirm";
import { HandleOnlyDate } from "../../services/HandleOnlyDate";
import { Head } from "../partials/Head";

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
    <Button
      id="button"
      className="bg-primary text-white"
      type="button"
      onClick={onClear}
    >
      X
    </Button>
  </>
);

export function Clients(this: any) {
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);

  const [idClient, setIdClient] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const handleClickOpen = (id: string) => {
    setIdClient(id);
    setOpen(true);
  };

  interface Props extends ExpanderComponentProps<any> {
    someTitleProp?: string;
  }

  const ExpandableRowComponent: React.FC<Props> = ({ data }) => {
    return (
      <>
        <table className="table-details">
          <tr className="font-weight-bold">
            <td>Data da Compra: </td>
            <td>Itens: </td>
            <td>Total: </td>
            <td>Vencimento: </td>
            <td className="text-center">Detalhes </td>
          </tr>
          {data.sales.map((item: any) => (
            <tr key={item.id}>
              <td>{HandleOnlyDate(new Date(item.createdAt))}</td>
              <td>{item.quantity}</td>
              <td>R$ {item.totalProduct.toFixed(2)}</td>
              <td>{HandleOnlyDate(new Date(item.dueData))}</td>
              <td className="text-center">
                <Link to={`/sale/saleDetail/${item.id}`}>
                <IconButton>
                  <InfoIcon />
                </IconButton>
                </Link>
              </td>
            </tr>
          ))}
        </table>
      </>
    );
  };

  /*Consultas BACKEND */
  useEffect(() => {
    const aux = () => {
      api
        .get("/clients/" + id)
        .then((res) => {
          console.log(res.data);
          setClients(res.data);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    };
    aux();
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
      name: "Cadastro",
      selector: (row: any) => HandleOnlyDate(new Date(row.createdAt)),
      sortable: true,
    },
    {
      name: "Valor em Aberto",
      selector: (row: any) =>
        !row.balance
          ? "Sem débitos"
          : "R$ " + parseFloat(row.balance).toFixed(2),
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
    },
  ];

  return (
    <>
      <Head title="ControlSoft - Clientes" />
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
            expandableRows
            subHeaderComponent={subHeaderComponentMemo}
            expandableRowsComponent={ExpandableRowComponent}
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

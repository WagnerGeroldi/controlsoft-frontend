/*imports react */
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

/*imports libs */
import { ToastContainer, toast } from "react-toastify";
import DataTable from "react-data-table-component";

/*imports extras */
import { api } from "../../api/api";
import { Header } from "../partials/Header";

/*imports styles CSS */

import "react-toastify/dist/ReactToastify.css";
import "./Products.scss"

/*imports MUI */
import Paper from "@mui/material/Paper";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { ModalConfirm } from "../../components/Modals/ModalConfirm";
import { Head } from "../partials/Head";

import {HandleOnlyDate} from "../../services/HandleOnlyDate"

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

const textModal = "Deseja apagar este produto?";

export function Products(this: any) {
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const [products, setProducts] = useState([]);

  const [idProduct, setIdProduct] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClickOpen = (id: string) => {
    setIdProduct(id);
    setOpen(true);
  };

  /*Consultas BACKEND */
  useEffect(() => {
    api
      .get("/products/" + id)
      .then((res) => {
        setProducts(res.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  async function deleteProduct(id: string) {
    await api
      .delete("products/" + id)
      .then((res) => {
        const message = res.data.message;
        toast.success(message);
        const newProducts = products.filter((product: any) => product.id !== id);
        setProducts(newProducts);
      })
      .catch(() => {
        toast.error("Houve um erro, tente novamente");
      });

    handleClose();
  }

  function updateProduct(id: number) {
    navigate(`/products/updateProduct/${id}`);
  }

    /*lidar com filtro da lista */
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const filteredItems = products.filter(
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
        name: "Valor",
        selector: (row: any) => `R$  ${row.price.toFixed(2)}`,
        sortable: true,
      },
      {
        name: "Estoque",
        selector: (row: any) => row.quantity,
        sortable: true,
      },
      {
        name: "Cadastro",
        selector: (row: any) => HandleOnlyDate(new Date(row.createdAt)),
        sortable: true,
      },
      {
        cell: (row: any) => (
          <IconButton
            aria-label="update"
            size="large"
            onClick={updateProduct.bind(this, row.id)}
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
    ];

    return (
      <>
        <Head
    title= "ControlSoft - Produtos"
    />
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
          <Link to={`/products/createProduct/${id}`}>
            <Button variant="contained" color="success" startIcon={<AddIcon />}>
              Cadastrar Produto
            </Button>
          </Link>
          <div className="info-user">
            <h1> Produtos </h1>
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
          action={deleteProduct.bind(this, idProduct)}
          title="Deseja excluir este produto?"
          setOpen={open}
          setClose={handleClose}
          infoOne="Excluir"
        />
      </>
    );
  }

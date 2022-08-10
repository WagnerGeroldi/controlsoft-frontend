/*imports react */
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/*imports MUI */
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import InventoryIcon from "@mui/icons-material/Inventory";
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
/*imports CSS */
import "./Header.scss";

/*imports IMAGENS */
import logo from "../../assets/images/logo-mini.svg";

/*imports Extras */
import {
  getUserLocalStorage,
  setAuthLocalStorage,
  setTokenLocalStorage,
  setUserLocalStorage,
} from "../../state/SaveLocalStorage";
import { ModalConfirm } from "../../components/Modals/ModalConfirm";
import { ShowSaudation } from "../../services/ShowSaudation";
import { HandleDate } from "../../services/HandleDate";

export function Header(this: any) {

  const user = getUserLocalStorage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const date = new Date(user.updatedAt);

  const lastacess = HandleDate(date);
  let navigate = useNavigate();

  function logout() {
    setUserLocalStorage(null)
    setTokenLocalStorage(null)
    setAuthLocalStorage(null);
    navigate(`/`);
  }

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClick = (route: any) => {
    navigate(route);
    handleToggleMenu();
  };

  return (
    <>
      <Drawer open={menuOpen} onClose={() => handleToggleMenu()}>
        <List>
          <ListItem
            button
            onClick={() => handleMenuClick(`/dashboard/${user.id}`)}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Início</ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={() => handleMenuClick(`/products/${user.id}`)}
          >
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText>Lista de Produtos</ListItemText>
          </ListItem>

          <ListItem
            button
            onClick={() => handleMenuClick(`/category/${user.id}`)}
          >
            <ListItemIcon>
              <BookmarksIcon />
            </ListItemIcon>
            <ListItemText>Categorias</ListItemText>
          </ListItem>

          <ListItem button onClick={() => handleMenuClick(`/order/newDecreaseOrder/${user.id}`)}>
            <ListItemIcon>
              <ArrowDropDownCircleIcon />
            </ListItemIcon>
            <ListItemText>Baixar produtos</ListItemText>
          </ListItem>
          <ListItem button onClick={() => handleMenuClick(`/report/${user.id}`)}>
            <ListItemIcon>
              <LocalPrintshopIcon />
            </ListItemIcon>
            <ListItemText>Relatórios</ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={() => handleMenuClick(`/user/config/${user.id}`)}
          >
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText>Configurações</ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <header className="header-main">
        <div className="area-logo">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => handleToggleMenu()}
          >
            <MenuIcon />
          </IconButton>
          <Link to={`/dashboard/${user.id}`}>
            <img src={logo} alt="LOGO" width={55} />
          </Link>
          <div className="area-logo-text">
            <span>Rede Unisoft</span>
            <div>
              <small>Controle de Estoque</small>
            </div>
          </div>
        </div>
        <p>
          {!user ? (
            <Link to="/login">
              <button>Login</button>
            </Link>
          ) : (
            <div className="btn-header">
              <div>
                <span>
                  {" "}
                  {ShowSaudation()} <strong>{user.name}</strong>
                </span>
                <br />
                <span>
                  <small>
                    Último acesso:{" "}
                    <span className="lastacess"> {lastacess} </span>
                  </small>
                </span>
              </div>

              <Button variant="contained" color="primary" onClick={handleOpen}>
                Sair
              </Button>
            </div>
          )}
        </p>
      </header>
      <ModalConfirm
        action={() => logout()}
        title="Tem certeza que deseja sair?"
        setOpen={open}
        setClose={handleClose}
        infoOne="Sair"
      />
    </>
  );
}

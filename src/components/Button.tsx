/*imports REACT */
import { Link } from "react-router-dom";

/*imports MUI */
import { Stack, Button } from "@mui/material";

/*INTERFACE */
import { IButton } from "./types/ComponentsInterfaces";

function ButtonDefault(props: IButton) {
  return (
    <Stack spacing={2} marginTop={2} direction="row" justifyContent="center">
      <Button type="submit" variant="contained">
        {props.contentBtnPrimary}
      </Button>
      <Link to={props.link}>
        <Button variant="contained" color="secondary">
          {props.contentBtnSecondary}
        </Button>
      </Link>
    </Stack>
  );
}

export { ButtonDefault };
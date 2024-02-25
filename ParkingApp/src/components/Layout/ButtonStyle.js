import { Button, styled } from "@mui/material";
import { blue } from "@mui/material/colors";

export const BlueButton = styled(Button)({
  "&:hover": {
    backgroundColor: blue[50],
    color: "#0d47a1",
  },
});

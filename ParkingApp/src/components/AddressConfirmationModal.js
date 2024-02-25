import { Typography, Modal, Button } from "@mui/material";

export const AddressConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  address,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="address-confirmation-modal"
      aria-describedby="confirm-heading"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" id="confirm-heading" gutterBottom>
          Do you want to head to:
          <br /> {address}
        </Typography>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }}
        >
          Yes
        </Button>
        <Button onClick={onClose} variant="contained" color="secondary">
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default AddressConfirmationModal;

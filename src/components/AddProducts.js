import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link, json, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function AddProducts() {
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);
  const [file, setFile] = React.useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileCancel = () => {
    setFile(null);
    document.getElementsByName("file").value = null;
  };

  console.log(file);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const price = data.get("price");
    const brand = data.get("brand");
    const category = data.get("category");
    const user_id = JSON.parse(localStorage.getItem("user")).user_id;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("brand", brand);
    formData.append("category", category);
    formData.append("user_id", user_id);
    formData.append("image", file);

    if (!name) {
      setError("Please Enter Name");
      return false;
    } else if (!price) {
      setError("Please Enter Price");
      return false;
    } else if (!brand) {
      setError("Please Enter Brand");
      return false;
    } else if (!category) {
      setError("Please Enter Category");
      return false;
    }
    console.log("FILE: " + file);
    const isAddProduct = window.confirm("Do you want to add this product ? ");
    if (isAddProduct) {
      const result = await fetch(
        process.env.REACT_APP_SERVER_URL + ":3000/addproducts",
        {
          method: "POST",
          body: formData,
          headers: {
            authorization: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      console.log("Result: " + result);
      if (result) {
        console.log("Data is saved" + result);
        alert("Product Added");
        setError(null);
        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        document.getElementById("brand").value = "";
        document.getElementById("category").value = "";
        navigate("/");
      } else {
        console.log("Error");
      }
    } else {
      alert("Product Not Added");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "white",
            borderRadius: 5,
            padding: 5,
          }}
        >
          <Typography component="h1" variant="h5">
            Add Products
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {error && <Alert severity="error">{error}</Alert>}
            {/* Display Alert if error state is set */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Name"
              type="name"
              id="name"
              autoComplete="current-name"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="price"
              label="Price"
              name="price"
              autoComplete="price"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="brand"
              label="Brand"
              name="brand"
              autoComplete="brand"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="category"
              label="Category"
              name="category"
              autoComplete="category"
              autoFocus
            />
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{ backgroundColor: "#311b92" }}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                name="file"
                onChange={handleFileChange}
              />
            </Button>
            {file ? (
              <>
                <Button variant="text">{file?.name}</Button>
                <Button
                  variant="text"
                  startIcon={<CloseIcon />}
                  onClick={handleFileCancel}
                  sx={{ backgroundColor: "#311b92" }}
                ></Button>
              </>
            ) : (
              ""
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#311b92" }}
            >
              Add Product
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

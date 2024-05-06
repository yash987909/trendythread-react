import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link, json, useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function UpdateProduct() {
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);
  let productDetails;
  const params = useParams();

  //   console.log(params.id);

  React.useEffect(() => {
    getProductList();
  }, []);

  async function getProductList(event) {
    try {
      let result = await fetch(
        process.env.REACT_APP_SERVER_URL + ":3000/updateproduct/" + params.id,
        {
          method: "post",
          body: JSON.stringify(),
          headers: {
            authorization: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (result) {
        result = await result.json();
        productDetails = result[0];
        document.getElementById("name").value = productDetails.name;
        document.getElementById("price").value = productDetails.price;
        document.getElementById("brand").value = productDetails.brand;
        document.getElementById("category").value = productDetails.category;
      } else {
        console.log("Error Fetching Products");
      }
    } catch (error) {
      console.log("Error Fetching Result");
    }

    console.log(productDetails);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const price = data.get("price");
    const brand = data.get("brand");
    const category = data.get("category");
    const user_id = JSON.parse(localStorage.getItem("user")).user_id;
    const product_id = params.id;

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
    const isUpdate = window.confirm("Do you want to Update this Product? ");
    if (isUpdate) {
      const result = await fetch(
        process.env.REACT_APP_SERVER_URL + ":3000/updateproductdetails",
        {
          method: "post",
          body: JSON.stringify({
            product_id,
            name,
            price,
            brand,
            category,
            user_id,
          }),
          headers: {
            authorization: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(result);
      if (result) {
        console.log("Data is Updated" + result);
        alert("Product Updated");
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
      alert("Update canceled");
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
            Update Product
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {error && <Alert severity="error">{error}</Alert>}{" "}
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
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="brand"
              label="Brand"
              name="brand"
              autoComplete="brand"
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#311b92" }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

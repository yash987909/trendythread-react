import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Alert from "@mui/material/Alert";

function Copyright(props) {
  return (
    <Typography variant="body2" color="white" align="center" {...props}>
      {"Copyright © "}
      <Link
        href="https://mui.com/"
        style={{ color: "white", textDecoration: "none" }}
      >
        TrendyThread
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");
    const password = data.get("password");
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");

    const passwordCriteria = "@#$%^&*!~?/.+-";

    if (!firstName) {
      setError("FirstName is required !");
      return;
    }
    if (!lastName) {
      setError("LastName is required !");
      return;
    }
    if (!email) {
      setError("Email is required !");
      return;
    }
    if (!password) {
      setError("Password is required !");
      return;
    }
    if (password.length < 8) {
      setError("Password Should be more than 8 characters");
      return;
    }
    console.log("YASHSHSSH" + password.includes(passwordCriteria));
    if (!password.includes(passwordCriteria)) {
      setError("Password Should contain Special Characters");
      return;
    }
    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER_URL + ":3000/signup",
        {
          method: "post",
          body: JSON.stringify({ firstName, lastName, email, password }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const response = await fetch(
          process.env.REACT_APP_SERVER_URL + ":3000/signin",
          {
            method: "post",
            body: JSON.stringify({ email, password }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const userData = await response.json();
        console.log("User data:", userData);

        // Save user data to local storage
        localStorage.setItem("user", JSON.stringify(userData.result));
        localStorage.setItem("token", JSON.stringify(userData.auth));

        navigate("/");
      } else {
        console.error("Signup failed:", response.statusText);
        // Handle signup failure here
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle other errors here
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            {error && <Alert severity="error">{error}</Alert>}{" "}
            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#311b92" }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/signin" style={{ textDecoration: "none" }}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

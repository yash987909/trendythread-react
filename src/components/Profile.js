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
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import { deepOrange, deepPurple } from "@mui/material/colors";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Profile() {
  const [error, setError] = React.useState(null);
  const [avatar, setAvatar] = React.useState(null);
  const [passwordChange, setPasswordChange] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [visibleChangePassword, setvisibleChangePassword] =
    React.useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [profileUrl, setProfileUrl] = React.useState(
    JSON.parse(localStorage.getItem("profile_url"))
  );

  console.log("Profile URL " + profileUrl);

  React.useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    try {
      let result = await fetch(
        process.env.REACT_APP_SERVER_URL + ":3000/profile/" + params.id,
        {
          method: "post",
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
        setAvatar(result.firstname);
        document.getElementById("firstname").value = result.firstname;
        document.getElementById("lastname").value = result.lastname;
        document.getElementById("email").value = result.email;
        localStorage.setItem("user", JSON.stringify(result));
        localStorage.setItem(
          "profile_url",
          JSON.stringify(result.profile_image)
        );
        setFile(null);
        setProfileUrl(JSON.parse(localStorage.getItem("user")).profile_image);
      } else {
        console.log("Error Getting User");
      }
    } catch (error) {
      console.log("Error Fetching Result");
    }
  }

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

  const changePassword = async () => {
    let email = JSON.parse(localStorage.getItem("user")).email;
    let password = window.prompt("Please Enter Old Password:- ");
    try {
      let response = await fetch(
        process.env.REACT_APP_SERVER_URL + ":3000/changepassword",
        {
          method: "post",
          body: JSON.stringify({ email, password }),
          headers: {
            authorization: `bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
            "Content-Type": "application/json",
          },
        }
      );
      response = await response.json();
      if (response) {
        setPasswordChange(true);
        setvisibleChangePassword(true);
      } else {
        setPasswordChange(false);
        alert("Enter Valid old Password");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Enter Valid Credentials");
    }
  };

  const savePassword = async () => {
    let user_id = JSON.parse(localStorage.getItem("user")).user_id;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmpassword").value;
    if (password === confirmPassword) {
      try {
        let response = await fetch(
          process.env.REACT_APP_SERVER_URL + ":3000/updatepassword",
          {
            method: "post",
            body: JSON.stringify({ user_id, password }),
            headers: {
              authorization: `bearer ${JSON.parse(
                localStorage.getItem("token")
              )}`,
              "Content-Type": "application/json",
            },
          }
        );
        response = await response.json();
        if (response) {
          alert("Password Changed");
          localStorage.clear();
          navigate("/signin");
        } else {
          alert("Password Not Changed");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Enter Valid Credentials");
      }
    } else {
      setError("Password not Matched");
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSaveChanges = async () => {
    let user_id = JSON.parse(localStorage.getItem("user")).user_id;
    let oldProfile = profileUrl;

    console.log("CHANGES::" + file);

    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("oldProfile", oldProfile);
    formData.append("profile_image", file);

    try {
      let response = await fetch(
        process.env.REACT_APP_SERVER_URL + ":3000/addprofile",
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

      const result = await response.json();
      console.log("RESULT IMAGE:::" + result.image);
      localStorage.setItem("profile_url", JSON.stringify(result.image));
      setFile(null);
      setProfileUrl(JSON.parse(localStorage.getItem("profile_url")));
      navigate("/profile/" + user_id);
      // window.location.reload();
    } catch (error) {
      console.log("Not Able to Add Profile:" + error);
    }
  };

  // console.log(
  //   `URL::${process.env.REACT_APP_SERVER_URL}:3000/` +
  //     JSON.parse(localStorage.getItem("user")).profile_image
  // );

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            padding: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "white",
            borderRadius: 5,
          }}
        >
          {avatar ? (
            <Button
              // onClick={() => console.log("Please Upload Profile Picture!!")}
              // role={undefined}
              component="label"
              // tabIndex={-1}
            >
              <Avatar
                sx={{
                  bgcolor: deepOrange[500],
                  outline: "4px solid lightblue",
                  width: 100,
                  height: 100,
                  fontSize: 50,
                }}
                src={
                  file
                    ? URL.createObjectURL(file)
                    : `${process.env.REACT_APP_SERVER_URL}:3000/${profileUrl}`
                }
              >
                {!file && avatar.charAt(0).toUpperCase()}
              </Avatar>
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
          ) : (
            ""
          )}
          {file ? (
            <Button onClick={() => setFile(null)}>{`${file?.name} X`}</Button>
          ) : (
            ""
          )}
          <Typography component="h1" variant="h5">
            Profile
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}{" "}
            {/* Display Alert if error state is set */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="firstname"
              label="First Name"
              type="firstname"
              id="firstname"
              variant="filled"
              autoComplete="current-name"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastname"
              label="Last Name"
              name="lastname"
              variant="filled"
              autoComplete="lastname"
              autoFocus
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              variant="filled"
              autoComplete="email"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: true,
              }}
              autoFocus
            />
            {passwordChange ? (
              <div>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="password"
                  id="password"
                  label="Password"
                  name="password"
                  autoComplete="password"
                  InputLabelProps={{ shrink: true }}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="password"
                  id="confirmpassword"
                  label="Confirm Password"
                  name="confirmpassword"
                  autoComplete="confirmpassword"
                  InputLabelProps={{ shrink: true }}
                  autoFocus
                />
              </div>
            ) : (
              ""
            )}
            {!visibleChangePassword ? (
              <Button
                type="button"
                fullWidth
                variant="contained"
                onClick={changePassword}
                sx={{ mt: 3, backgroundColor: "#311b92" }}
              >
                Change Password
              </Button>
            ) : (
              <Button
                type="button"
                fullWidth
                variant="contained"
                onClick={savePassword}
                sx={{ mt: 3, backgroundColor: "#311b92" }}
              >
                Save Password
              </Button>
            )}
            {file ? (
              <Button
                type="button"
                fullWidth
                variant="contained"
                // onClick={saveChanges}
                sx={{ mt: 3, backgroundColor: "#311b92" }}
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

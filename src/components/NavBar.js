import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useMediaQuery } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { blue, deepOrange, deepPurple, red } from "@mui/material/colors";

function NavBar() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const auth = localStorage.getItem("user");
  const user_id = JSON.parse(localStorage.getItem("user"));

  let profile_url = JSON.parse(localStorage.getItem("profile_url"));
  let firstname = "T";

  if (auth) {
    firstname = JSON.parse(localStorage.getItem("user")).firstname;
    profile_url = JSON.parse(localStorage.getItem("profile_url"));
  }

  console.log(`${process.env.REACT_APP_SERVER_URL}:3000/${profile_url}`);

  let pages = auth
    ? ["Products", "Add Products", "Profile", "Logout"]
    : ["SignIn", "SignUp"];
  let settings = auth
    ? ["/", "/addproducts", "/profile/", "/logout"]
    : ["/signin", "/signup"];

  const handleLogout = () => {
    let isLogout = window.confirm("Do You Want to Logout ? ");
    if (isLogout) {
      localStorage.clear();
      console.log("Redirecting to /signin");
      navigate("/signin");
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    navigate("/profile/" + user_id.user_id);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#311b92" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <WhatshotIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />

          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              TrendyThread
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {settings.map((page, index) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  {page === "/logout" ? (
                    <Button
                      onClick={handleLogout}
                      style={{ textDecoration: "none" }}
                      sx={{ bgcolor: red[500] }}
                    >
                      <Typography textAlign="center" color={"whitesmoke"}>
                        {pages[index]}
                      </Typography>
                    </Button>
                  ) : (
                    <Button>
                      <Link
                        onClick={page === "/logout" ? handleLogout : ""}
                        to={
                          page === "/profile/" ? page + user_id.user_id : page
                        }
                        style={{ textDecoration: "none" }}
                      >
                        <Typography textAlign="center">
                          {pages[index]}
                        </Typography>
                      </Link>
                    </Button>
                  )}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <WhatshotIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              fontSize: {
                xs: "0.8rem", // Adjust the font size for xs (extra small) screens
                sm: "2rem", // Adjust the font size for sm (small) screens (if needed)
                md: "inherit", // Use the default font size for larger screens
              },
            }}
          >
            TrendyThread
          </Typography>
          {auth ? (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    <Typography variant="body2">Products</Typography>
                  </Button>
                </Link>

                <Link to="/addproducts" style={{ textDecoration: "none" }}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    <Typography variant="body2">Add Products</Typography>
                  </Button>
                </Link>

                {/* <Link to="/updateproducts" style={{ textDecoration: "none" }}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    <Typography variant="body2">Update Products</Typography>
                  </Button>
                </Link> */}

                <Link
                  to={"/profile/" + user_id.user_id}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    <Typography variant="body2">Profile</Typography>
                  </Button>
                </Link>
              </Box>
              {!isSmallScreen ? (
                <Button
                  onClick={handleLogout}
                  sx={{
                    mx: 1,
                    my: 2,
                    color: "white",
                    display: "block",
                    borderRadius: 2,
                    bgcolor: red[500],
                  }}
                >
                  <Typography variant="body2">Logout</Typography>
                </Button>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              {!isSmallScreen ? (
                <>
                  <Box
                    sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
                  ></Box>
                  <Link to="/Signup" style={{ textDecoration: "none" }}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      <Typography variant="body2">SignUp</Typography>
                    </Button>
                  </Link>
                  <Link to="/SignIn" style={{ textDecoration: "none" }}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      <Typography variant="body2">SignIn</Typography>
                    </Button>
                  </Link>
                </>
              ) : (
                ""
              )}
            </>
          )}

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    bgcolor: deepOrange[700],
                    border: "4px solid blue",
                    width: "3rem",
                    height: "3rem",
                  }}
                  src={
                    profile_url
                      ? `${process.env.REACT_APP_SERVER_URL}:3000/${profile_url}`
                      : "/broken-image.jpg"
                  }
                >
                  {profile_url ? null : firstname.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;

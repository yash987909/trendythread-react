import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import UpdateIcon from "@mui/icons-material/Update";
import Stack from "@mui/material/Stack";
import { visuallyHidden } from "@mui/utils";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import md5 from "md5";
import { bgBG } from "@mui/material/locale";
import { BorderAllRounded } from "@mui/icons-material";
import { colors } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

function createData(id, name, price, brand, category, user_id) {
  return {
    id,
    name,
    price,
    brand,
    category,
    user_id,
  };
}

let rows = [];
let selectedArr = [];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Product Name",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "brand",
    numeric: true,
    disablePadding: false,
    label: "Brand",
  },
  {
    id: "category",
    numeric: true,
    disablePadding: false,
    label: "Category",
  },
  {
    id: "user_id",
    numeric: true,
    disablePadding: false,
    label: "User Name",
  },
  {
    id: "Product Image",
    numeric: true,
    disablePadding: false,
    label: "Image",
  },
  {
    id: "update",
    numeric: true,
    disablePadding: false,
    label: "Update",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{ bgcolor: "whitesmoke" }}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, updateRows } = props;

  const handleDelete = async () => {
    let result;
    let deleteNames = [];

    rows.forEach((item) => {
      if (selectedArr.includes(item.product_id)) {
        deleteNames.push(" " + item.name);
      }
    });

    let permission = window.confirm(`Do You Want to Delete ${deleteNames}`);

    if (permission) {
      selectedArr.forEach(async (product_id) => {
        try {
          result = await fetch(
            process.env.REACT_APP_SERVER_URL + ":3000/delete",
            {
              method: "post",
              body: JSON.stringify({ product_id }),
              headers: {
                authorization: `bearer ${JSON.parse(
                  localStorage.getItem("token")
                )}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (result) {
            updateRows(selectedArr.filter((product) => product !== product_id));
            alert("Product Deleted");
          } else {
            console.warn("Error in Deleting");
          }
        } catch (error) {
          console.warn("Error in Deleting");
        }
      });
    } else {
      alert("Canceled");
    }
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{
            flex: "1 1 100%",
            fontWeight: 300,
            bgcolor: "whitesmoke",
            color: "#311b92",
            borderRadius: 20,
            padding: 1,
            marginBottom: 2,
          }}
          variant="h4"
          id="tableTitle"
          component="div"
        >
          Product List
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        ""
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = React.useState(rows);
  const [order, setOrder] = React.useState(null);
  const [orderBy, setOrderBy] = React.useState(null);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedArrFun, setSelectedArrFun] = React.useState([]);
  const [searched, setSearched] = React.useState("");

  const updateRows = (newRows) => {
    setSelectedArrFun(newRows);
  };

  React.useEffect(() => {
    getProductList();
  }, [selectedArrFun]);
  // React.useEffect(()=>{
  //   getProductList();
  // })
  async function getProductList() {
    try {
      let result = await fetch(process.env.REACT_APP_SERVER_URL + ":3000/", {
        method: "post",
        body: JSON.stringify(),
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
          "Content-Type": "application/json",
        },
      });
      if (result) {
        result = await result.json();
        rows = result;
        setProducts(result);
      } else {
        console.log("Error Fetching Products");
      }
    } catch (error) {
      console.log("Error Fetching Result");
    }
  }

  const requestSearch = (searchedVal) => {
    setSearched(searchedVal);
    if (searchedVal) {
      const filteredRows = rows.filter((row) => {
        let name = row.name;
        return name.toLowerCase().includes(searchedVal.toLowerCase());
      });
      setProducts(filteredRows);
    } else {
      setProducts(rows);
    }
  };

  products.map((item, index) => {
    return createData(
      item.product_id,
      item.name,
      item.price,
      item.brand,
      item.category,
      item.user_id
    );
  });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = products.map((n) => n.product_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  selectedArr = selected;

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(products, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, products, selectedArr]
  );

  const openImageInNewTab = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Stack
          spacing={2}
          sx={{
            width: 300,
            margin: 2,
            bgcolor: "white",
            borderRadius: 2,
          }}
        >
          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            onChange={(event, newValue) => {
              requestSearch(newValue);
            }}
            disableClearable
            options={rows.map((option) => option.name)}
            renderInput={(params) => (
              <TextField
                {...params}
                // label="Search Products"
                placeholder="Search Products"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                value={searched}
                onChange={(searchVal) => requestSearch(searchVal.target.value)}
                sx={{
                  "& .MuiFormLabel-root": {
                    color: "black",
                  },
                }}
                // onCancelSearch={() => cancelSearch()}
              />
            )}
          />
        </Stack>
      </Grid>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          bgcolor: "white",
          borderRadius: 5,
          padding: isSmallScreen ? 2 : 5,
        }}
      >
        <EnhancedTableToolbar
          numSelected={selected.length}
          updateRows={updateRows}
          key={rows.product_id}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            key={rows.product_id}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={products.length}
              key={products.product_id}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.product_id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.product_id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        value={row.product_id}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                    <TableCell align="right">{row.brand}</TableCell>
                    <TableCell align="right">{row.category}</TableCell>
                    <TableCell align="right">
                      {row.firstname.charAt(0).toUpperCase() +
                        row.firstname.slice(1) +
                        " " +
                        row.lastname.charAt(0).toUpperCase() +
                        row.lastname.slice(1)}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        color="info"
                        sx={{ backgroundColor: "#311b92" }}
                        onClick={() =>
                          openImageInNewTab(
                            `${process.env.REACT_APP_SERVER_URL}:3000/` +
                              row.image
                          )
                        }
                      >
                        Image
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <Link to={"/updateproduct/" + row.product_id}>
                        <Button
                          variant="contained"
                          size="small"
                          color="info"
                          startIcon={<UpdateIcon />}
                          sx={{ backgroundColor: "#311b92" }}
                        >
                          Update
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        sx={{
          bgcolor: "inherit",
          padding: 0.5,
          borderRadius: 3,
          color: "white",
          "& .MuiTypography-root": {
            fontWeight: "bold",
            fontSize: "1.5rem",
          },
        }}
        control={
          <Switch
            checked={dense}
            onChange={handleChangeDense}
            color="warning"
          />
        }
        label="Dense padding"
      />
    </Box>
  );
}

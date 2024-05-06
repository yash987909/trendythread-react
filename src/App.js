import "./App.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AddProducts from "./components/AddProducts";
import ProductList from "./components/ProductList";
import PrivateComponent from "./components/PrivateComponent";
import UpdateProduct from "./components/UpdateProduct";
import Profile from "./components/Profile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes style={{ minHeight: "100vh" }}>
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<ProductList />} />
            <Route path="/addproducts" element={<AddProducts />} />
            <Route path="/updateproduct/:id" element={<UpdateProduct />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

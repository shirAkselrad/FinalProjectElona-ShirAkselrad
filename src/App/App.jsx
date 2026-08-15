import "../App/app.module.css";
import Header from "../components/Header/Header.jsx"
import ShopPage from "../components/Shop-Page/ShopPage/ShopPage.jsx";
import InfoPopup from "../components/Shop-Page/Info-Popup/InfoPopup/InfoPopup.jsx";
import Cart from "../components/General/CartWindow/Cart/Cart.jsx";
import Footer from "../components/Footer/Footer.jsx";

import products from "../components/Shop-Page/proudcts.js";
function App() {
  return (
    <div className="app">
      <Header/>
      <ShopPage/>
      <Cart/>
      <InfoPopup product={products[1]} />
      <Footer />
    </div>
  );
}

export default App;

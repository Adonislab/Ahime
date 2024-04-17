import '../styles/App.css';
import Home from './Home';
import Boutique from './Boutique';
import Produit from './Produits';
import About from './About';

import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <Link to="/" className="nav-item">ACCUEIL</Link>    
          <Link to="/produits" className="nav-item">PRODUIT</Link>       
          <Link to="/boutique" className="nav-item">BOUTIQUE</Link>
          <Link to="/chat" className="nav-item">EEIA_CHAT</Link>
        </nav> 
      </header>

      <Routes> 
        <Route path="/" element={<Home />}></Route>
        <Route path="/chat" element={<About />}></Route>
        <Route path="/produits" element={<Produit />}></Route>
        <Route path="/boutique" element={<Boutique />}></Route>
      </Routes>
    </div>
  );
}

export default App;

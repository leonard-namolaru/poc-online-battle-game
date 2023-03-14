import React, {StrictMode,useState} from "react";
import ReactDOM from "react-dom"
import {BrowserRouter , Routes , Route} from "react-router-dom"
import Trainer from "./pages/Home";
import Pokemon from "./pages/Pokemon";
import Login from "./pages/inscription_login/Login";
import UserPage from "./pages/user/userPage"
import Homepage from "./pages/accueil/accueil"
import Battle from "./pages/battle/battle"
import Footer from './pages/menu/footer';
import AppBarMenu from './pages/menu/AppBar';
import BattlePage from "./pages/battle/BattlePage"

const App = () => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
  
    const handleConnect = () => {
      // Cauthentication,  set isConnected and userInfo
    };
  
    const handleDisconnect = () => {
      // user logout, reset isConnected and userInfo
    };
  
    const Sign = () =>{
      // 
    }
    return (
        <div style={{display: "flex", flexDirection: "column",minHeight: "100vh",}}>

        <header style={{ height: "60px" }} >
             <div style={{ height: '0.2cm', background: 'linear-gradient(to right, green, yellow, blue, pink, brown, gray)'}}/>
             { <AppBarMenu  isConnected={isConnected} handleConnect={handleConnect} handleDisconnect={handleDisconnect} handleSign={Sign}/>}  
       </header>
 
        <main style={{ flexGrow: 1 }}>
                <Routes>
                    <Route>
                        {/* <Route index element={<Login />} /> */}
                        <Route index element={<Homepage />} />
                        <Route path="/pokemon/:userID" element={<Pokemon />} />
                        <Route path="/trainer" element={<Trainer />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/user/:userID" element={<UserPage />} />
                        <Route path="/user/:userID/battle" element={<Battle />} />
                        <Route path="/battle/:userID" element={<BattlePage />} />
                    </Route>
                </Routes>
         </main>
 
         {<Footer Address='5, rue Thomas Mann 75013 PARIS' Email='@pokemons' Name='pokemos ' Phone='+3310568971' 
            facebookUrl="https://facebook.com"
            twitterUrl="https://twitter.com"
            instagramUrl="https://instagram.com"
            linkedInUrl="https://linked.com"
         />}
   </div>

    );
};

const rootElement = document.getElementById("app")
ReactDOM.render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
    rootElement
);
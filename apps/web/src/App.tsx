import React, {StrictMode} from "react";
import ReactDOM from "react-dom"
import {BrowserRouter , Routes , Route} from "react-router-dom"
import Trainer from "./pages/Home";
import Pokemon from "./pages/Pokemon";
import Login from "./pages/inscription_login/Login";
import UserPage from "./pages/user/userPage"
import Homepage from "./pages/accueil/accueil"
import Battle from "./pages/battle/battle"



const App = () => {
    return (
        <Routes>
            <Route>
                {/* <Route index element={<Login />} /> */}
                <Route index element={<Homepage />} />
                <Route path="/pokemon" element={<Pokemon />} />
                <Route path="/trainer" element={<Trainer />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user/:userID" element={<UserPage />} />
                <Route path="/user/:userID/battle" element={<Battle />} />
            </Route>
        </Routes>
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
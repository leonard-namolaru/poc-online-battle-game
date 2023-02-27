import React, {StrictMode} from "react";
import ReactDOM from "react-dom"
import {BrowserRouter , Routes , Route} from "react-router-dom"
import Trainer from "./pages/Home";
import Pokemon from "./pages/Pokemon";
import Login from "./pages/Login";
import UserPage from "./pages/user/userPage"
import Homepage from "./pages/accueil/accueil"




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
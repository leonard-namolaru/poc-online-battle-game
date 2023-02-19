import React, {StrictMode, useEffect, useState} from "react";
import ReactDOM from "react-dom"
import {BrowserRouter , Routes , Route,  Outlet, Link} from "react-router-dom"
import Home, { ListeTrainerForme } from "./pages/Home";
import Pokemon from "./pages/Pokemon";
import Login from "./pages/Login";
import UserPage from "./pages/user/userPage"
import   ResponsiveMenu from "./pages/menu/menu";

function AppLayout() {
    const menuItems = [
        { label: 'Accueil', path: '/' },
        { label: 'Création de pokemon', path: '/pokemon' },
        { label: 'Dresseurs', path: '/trainer' },
      ];
    return (
       
        <>
            {/* <nav> */}
                {/* //<ul> */}
                <ResponsiveMenu menuItems={menuItems} />
                {/* //</ul> */}
            {/* </nav> */}
            <Outlet />
        </>

            
    )
}

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Login />} />
                <Route path="/pokemon" element={<Pokemon />} />
                <Route path="/trainer" element={<Home />} />
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
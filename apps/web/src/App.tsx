import React, {StrictMode, useEffect, useState} from "react";
import ReactDOM from "react-dom"
import {BrowserRouter, Routes , Route, Outlet, Link} from "react-router-dom"
import Home, { ListeTrainerForme } from "./pages/Home";
import Pokemon from "./pages/Pokemon";
import Login from "./pages/Login";

function AppLayout() {
    return (
        <>
            <nav>
                <ul>
                    <li> <Link to="/">Accueil</Link> </li>
                    <li> <Link to="/pokemon">Création de pokemon</Link> </li>
                    <li> <Link to="/trainer">Dresseurs</Link> </li>
                </ul>
            </nav>
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
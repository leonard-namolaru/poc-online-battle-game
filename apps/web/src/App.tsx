import React, {StrictMode} from "react";
import ReactDOM from "react-dom"
import {BrowserRouter, Routes , Route, Outlet, Link} from "react-router-dom"
import Home from "./pages/Home";
import Pokemon from "./pages/Pokemon";

function AppLayout() {
    return (
        <>
            <nav>
                <ul>
                    <li> <Link to="/">Accueil</Link> </li>
                    <li> <Link to="/pokemon">Création de pokemon</Link> </li>
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
                <Route index element={<Home />} />
                <Route path="/pokemon" element={<Pokemon />} />
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

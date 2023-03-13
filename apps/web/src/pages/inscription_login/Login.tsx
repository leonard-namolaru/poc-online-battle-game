import React, {StrictMode, useEffect, useState} from "react";
import ReactDOM from "react-dom"
import {BrowserRouter, Routes , Route, Outlet, Link, useNavigate} from "react-router-dom"
import "../../index.scss";
import axios from "../../api";
import styled from 'styled-components';
import Footer from '../accueil/footer';

import { Navigate } from "react-router-dom";
// const navigate = useNavigate();
const urlLoginPost = "/login";
type User = {
    // name: string;
    email: string;
    pwd: string;
};

export type ListeUserForme = {
    id: number;
    email: string;

};




const Title = styled.h1`
font-size: 70px;
margin-bottom: 20px;
font-family: 'Pokemon Solid', sans-serif;
color: #FFCB04;
text-shadow:
    3px 3px 0 #39569E,
    -1px -1px 0 #39569E,
    1px -1px 0 #39569E,
    -1px 4px 0 #39569E,
    1px 1px 0 #39569E;
`;
const Title2 = styled.h1`
font-size: 40px;
font-family: 'Pokemon Solid', sans-serif;
color: #FFCB04;
text-shadow:
    3px 3px 0 #39569E,
    -1px -1px 0 #39569E,
    1px -1px 0 #39569E,
    -1px 4px 0 #39569E,
    1px 1px 0 #39569E;
`;


const Login = () => {
    const [users, getusers] = useState<ListeUserForme[] | null>();
    const navigate = useNavigate();
    useEffect(() => {
        const url = "/seealllog";
        axios.get(url).then((response) => {
            getusers(response.data);
        });
    }, []);

    const [user, setUser] = useState<User>({
        email: "",
        pwd:"",
    });
    const [userLogin, setUserLogin] = useState<User>({
        email: "",
        pwd:"",
    });

    const setNewValue = (id_: string, newValue: string) =>
        setUser((prevState) => ({ ...prevState, [id_]: newValue }));
    
    const setNewValueLogin = (id_: string, newValue: string) =>
        setUserLogin((prevState) => ({ ...prevState, [id_]: newValue }));

    const createUser = async () => {
        try {
            const response = await axios.post(urlLoginPost, user);
            alert(`The reponse is: ${response.data.id}`);
        } catch (exception_) {
            alert(`There was an error `);
        }
    };
    const log = async () => {
        try {
           
            const response = await axios.post("/log", user);
            alert(`The reponse is: ${response.data.id}`);
            navigate(`/user/${response.data.id}`);
          
        } catch (exception_) {
            alert(`There was an error here`);
        }
    };
    return (
        <div style={{display: "flex", flexDirection: "column",minHeight: "100vh",}}>

        <header style={{ height: "60px" }} >
        </header>
  
         <main style={{ flexGrow: 1 }}>
         <div className="mt-10 text-3xl mx-auto max-w-6xl">
            <div className="divTitle">
                <Title><p>PoCAmon</p></Title> <Title2><p>Le jeu ultime</p></Title2>
            </div>
            <div className="module-border-wrap">
                <div className="div3">
                <h1>Inscription : </h1>
                <input
                    placeholder="email"
                    value={user.email}
                    onChange={(evt) => {
                        setNewValue("email", evt.target.value);
                    }}
                />
                <br />
                <input type="password"
                    placeholder="mot de passe"
                    value={user.pwd}
                    onChange={(evt) => {
                        setNewValue("pwd", evt.target.value);
                    }}
                />
                <br />
                <button
                    onClick={() => {
                        createUser();
                    }}
                >
                    Enregister
                </button>
                </div>
            </div>

            <div className="module-border-wrap2">
                <div className="div3">
                <h1>Se connecter  : </h1>
                <input
                    placeholder="email"
                    value={userLogin.email}
                    onChange={(evt) => {
                        setNewValueLogin("email", evt.target.value);
                    }}
                />
                <br />
                <input type="password"
                    placeholder="mot de passe"
                    value={userLogin.pwd}
                    onChange={(evt) => {
                        setNewValueLogin("pwd", evt.target.value);
                    }}
                />
                <br />
                <button
                    onClick={() => {
                        // createUser();
                        log();
                    }}
                >
                    Connexion
                </button>
                </div>
            </div>
            <div className="gifacceuil">
            </div>
        </div>
          </main>
  
          {<Footer Address='20 rue ismail' Email='ismail' Name='pokemos ' Phone='+25364216841265' 
             facebookUrl="https://facebook.com/"
             twitterUrl="https://twitter.com/"
             instagramUrl="https://instagram.com/"
             linkedInUrl="https://linked.com/"
          />}
    </div>
        
    );
};

export default Login;
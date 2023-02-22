import React, {StrictMode, useEffect, useState} from "react";
import ReactDOM from "react-dom"
import {BrowserRouter, Routes , Route, Outlet, Link} from "react-router-dom"
import "../index.scss";
import axios from "axios";


const urlLoginPost = "http://localhost:3000/login";
type User = {
    // name: string;
    email: string;
    pwd: string;
};

export type ListeUserForme = {
    id: number;
    email: string;

};

const Login = () => {
    const [users, getusers] = useState<ListeUserForme[] | null>();
    useEffect(() => {
        const url = "http://localhost:3000/seealllog";
        axios.get(url).then((response) => {
            getusers(response.data);
        });
    }, []);

    const [user, setUser] = useState<User>({
        email: "",
        pwd:"",
    });

    const setNewValue = (id_: string, newValue: string) =>
        setUser((prevState) => ({ ...prevState, [id_]: newValue }));

    const createUser = async () => {
        try {
            const response = await axios.post(urlLoginPost, user);
            alert(`The reponse is: ${response.data.id}`);
        } catch (exception_) {
            alert(`There was an error `);
        }
    };
    return (
        <div className="mt-10 text-3xl mx-auto max-w-6xl">
            <div className="div1">
                <h1>Liste des inscrits: </h1>
                {users
                    ? users.map((train) => {
                        return <p> {train.email}</p>;
                    })
                    : null}
            </div>
            <div className="div2">
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
    );
};

export default Login;
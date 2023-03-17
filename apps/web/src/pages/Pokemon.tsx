import apiClient from "../api";
import React, {useState} from "react";
import "../index.scss";
import {Pokemon} from  "../../../api/src/domain/entities";
import {useNavigate, useParams} from "react-router-dom";

const Home = () => {
    let {userID} = useParams();
    const navigate = useNavigate();

    const [pokemon, setPokemon] = useState<string>("");

    const [data, setData] = useState<Pokemon>({id: -1,
                                                        pokedex: -1,
                                                        name: "",
                                                        stats : {attack : -1, hp : -1},
                                                        item: {itemId : -1, name : "", effect : -1},
                                                        moves: [{name: "", damage : -1}],
                                                        exp:-1,
                                                        level:-1,
                                                        types: [] });


    const createPokemon = async () => {
        try {
            const response = await apiClient.post("/pokemon", {name: pokemon, userId : userID});
            setData({id: response.data.id,
                     pokedex: response.data.pokedex,
                     name: response.data.name,
                     stats : response.data.stats,
                     item: response.data.item,
                     moves: response.data.moves,
                     exp: response.data.exp,
                     level: response.data.level,
                     types: response.data.types })

        } catch(error : any) {
            alert("Problème lors de l'ajout du pokémon.")
        };;
    }

    const returnBack = () => {
        navigate(`/user/${userID}`);
    }


    return (
        <div className="mt-10 text-3xl mx-auto max-w-6xl">
            <div className="div2">
                <div style={{fontSize:"15px"}} onClick={() => {returnBack();}}>&lt; Retour a la page precedente</div>
                <h1>Ajouter un nouveau pokemon : </h1>
                <input
                    placeholder="name"
                    value={pokemon}
                    onChange={(evt) => {
                        setPokemon(evt.target.value);
                    }}
                />
                <br />
                <button onClick={() => {createPokemon();}}> Enregister </button>
            </div>

            <div>
                 <br />
                { (data.id != -1) ?
                    "Id : " + data.id
                    : ""}
                <br />
                { (data.id != -1) ?
                    "Pokedex :" + data.pokedex + "\n"
                    : ""}
                <br />
                { (data.id != -1) ?
                    "Exp :" + data.exp
                    : ""}
                <br />
                { (data.id != -1) ?
                    "Level :" + data.level
                    : ""}
                <br />
                { (data.id != -1) ?
                    "Item : "
                    +  " id :"  + data.item.itemId
                    +  " nom :"  + data.item.name
                    +  " effect :"  + data.item.effect
                    : ""}
                <br />
                { (data.id != -1) ?
                    "Stats : "
                    +  " attack :"  + data.stats.attack + "\n"
                    +  " hp :"  + data.stats.hp + "\n"
                    : ""}
                <br />
                { (data.id != -1) ?
                    "Moves : "
                    + data.moves[0].name + " : " + data.moves[0].damage
                    + data.moves[1].name + " : " + data.moves[1].damage
                    : ""}

            </div>
        </div>
    );
};

export default Home;


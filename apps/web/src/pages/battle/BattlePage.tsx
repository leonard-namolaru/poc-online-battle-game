import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {Avatar, Container, Grid, makeStyles, Typography} from '@material-ui/core';
import {User, Battle, Trainer, PokemonTeam} from  "../../../../api/src/domain/entities";
import apiClient from "../../api";
import {pageStyles} from "./BattlePageStyleSheet";

const undefinedBattle : Battle = {id: -1, attackingTrainerId: -1, opposingTrainerId: -1, attackerPokemonId: -1, opponentPokemonId: -1, winner: -1};
const undefinedTrainerActiveTeam : PokemonTeam = {teamId: -1, trainerId: -1, pokemonList: []};
const undefinedTrainer : Trainer = {id: -1, name: "", gender: "", activeTeam: undefinedTrainerActiveTeam};
const undefinedUser : User = {id: -1, name: "", pwd: "", email: "", inscriptionDate: new Date(), uniqueToken: "", isValid: false,
    trainer: undefinedTrainer, allMyPokemon: [], itemList: []};

const BattleField: React.FC<{ battle: Battle, currentTrainer: Trainer, opposingTrainer : Trainer, isTheAttacker: boolean, hpPointsPokemonsDuringBattle : {"pokemonId": number, "hp": number}[] }> = (battleSituation) => {

    let hpIndex : number = -1;
    return (
        <div style={{border: "1px solid #ccc", borderRadius: "10px"}}>
            <ul style={{ listStyleType: 'none', margin: 0, padding: 0, height: '200px', overflow: 'auto' }} >
                {battleSituation.currentTrainer.activeTeam.pokemonList
                    .filter((pokemon) => {return (battleSituation.battle.attackerPokemonId == pokemon.id || battleSituation.battle.opponentPokemonId == pokemon.id)})
                    .map(pokemon => (
                    <li key={pokemon.id} style={pageStyles.liLightgray}>
                        <span style={{ display : 'none' }}>{hpIndex = battleSituation.hpPointsPokemonsDuringBattle.findIndex((element) => {return element.pokemonId == pokemon.id}) }</span>

                        <div style={{ flex: 1 }}>
                            <h2 style={{margin: 0, fontSize: '1.2rem', fontWeight: 'bold',}}>{pokemon.name}</h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>{'hp : ' +  ((hpIndex != -1) ? battleSituation.hpPointsPokemonsDuringBattle[hpIndex].hp : pokemon.stats.hp)}</p>
                        </div>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Avatar className={pageStyles.image} style={{ marginRight: '10px' }}>
                                {(() => {( apiClient.get("https://pokeapi.co/api/v2/pokemon/" + pokemon.name)).then((response)=>{ document.getElementById(pokemon.name + "-" + pokemon.id + "-battle")?.setAttribute("src", response.data.sprites.front_default)})})() }
                                <img src="" alt={pokemon.name} id={pokemon.name + "-" + pokemon.id + "-battle"} />
                            </Avatar>
                        </div>
                    </li> ))}

                {battleSituation.opposingTrainer.activeTeam.pokemonList
                    .filter((pokemon) => {return (battleSituation.battle.attackerPokemonId == pokemon.id || battleSituation.battle.opponentPokemonId == pokemon.id)})
                    .map(pokemon => (
                        <li key={pokemon.id} style={pageStyles.liWhite}>

                            <span style={{ display : 'none' }}>{hpIndex = battleSituation.hpPointsPokemonsDuringBattle.findIndex((element) => {return element.pokemonId == pokemon.id}) }</span>

                            <div style={{ flex: 1 }}>
                                <h2 style={{margin: 0, fontSize: '1.2rem', fontWeight: 'bold',}}>{pokemon.name}</h2>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>{'hp : ' +  ((hpIndex != -1) ? battleSituation.hpPointsPokemonsDuringBattle[hpIndex].hp : pokemon.stats.hp)}</p>
                            </div>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Avatar className={pageStyles.image} style={{ marginRight: '10px' }}>
                                    {(() => {( apiClient.get("https://pokeapi.co/api/v2/pokemon/" + pokemon.name)).then((response)=>{ document.getElementById(pokemon.name + "-" + pokemon.id + "-battle")?.setAttribute("src", response.data.sprites.front_default)})})() }
                                    <img src="" alt={pokemon.name} id={pokemon.name + "-" + pokemon.id + "-battle"} />
                                </Avatar>
                            </div>
                        </li> ))}

            </ul>
        </div>
    );
};

const TrainerPokemonList: React.FC<{ battle: Battle, trainer: Trainer, isTheAttacker: boolean }> = (trainerInBattle) => {

    let isCurrentPokemon : boolean;
    return (
        <div style={{border: "1px solid #ccc", borderRadius: "10px"}}>
            <ul style={{ listStyleType: 'none', margin: 0, padding: 0, height: '200px', overflow: 'auto' }} >
                {trainerInBattle.trainer.activeTeam.pokemonList.map(pokemon => (
                    <li key={pokemon.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: (trainerInBattle.battle.attackerPokemonId == pokemon.id || trainerInBattle.battle.opponentPokemonId == pokemon.id) ? 'lightgray': 'white',
                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
                        borderRadius: '5px',
                        height: '60px',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        margin: '10px'
                    }}>
                        {isCurrentPokemon = trainerInBattle.battle.attackerPokemonId == pokemon.id || trainerInBattle.battle.opponentPokemonId == pokemon.id}

                        <div style={{ flex: 1 }}>
                    <h2 style={{margin: 0, fontSize: '1.2rem', fontWeight: 'bold',}}>{pokemon.name}</h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>{isCurrentPokemon ? 'En bataille' : 'hp : ' + pokemon.stats.hp}</p>
                        </div>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Avatar className={pageStyles.image} style={{ marginRight: '10px' }}>
                                {(() => {( apiClient.get("https://pokeapi.co/api/v2/pokemon/" + pokemon.name)).then((response)=>{ document.getElementById(pokemon.name + "-" + pokemon.id)?.setAttribute("src", response.data.sprites.front_default)})})() }
                                <img src="" alt={pokemon.name} id={pokemon.name + "-" + pokemon.id} />
                            </Avatar>
                        </div>
                    </li> ))}
            </ul>
        </div>
    );
};

const ColorfulButton: React.FC<{ text: string, backgroundColor: string, textColor: string, background: string, animation: string, fontFamily: string, border: string, backgroundSize: string, onClick: () => void, display : string }> =
    ({backgroundSize, border ='none', text, backgroundColor = '#000', textColor = '#fff', background ,onClick ,animation, fontFamily, display}) => {
    const[localbackground, setLocalBackgroude] = useState(background)
    useEffect(() => {
        console.log('value of background has changed to :', background)
        setLocalBackgroude(background)
    },[background]);
    return (
        <button
            style={{
                fontFamily,
                animation,
                backgroundColor,
                background :localbackground ,
                backgroundSize,
                backgroundRepeat: 'no-repeat',
                color: textColor,
                border,
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                boxShadow: '0px 0px 5px #888888',
                fontWeight: 'bold',
                display: display
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0px 0px 10px #888888';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

const handleClick = (opposingTrainer : Trainer, updateBattleFunction :  React.Dispatch<React.SetStateAction<Battle>>, setHpPointsPokemonsDuringBattle: React.Dispatch<React.SetStateAction<{pokemonId: number, hp: number}[]>>, setGameOver: React.Dispatch<React.SetStateAction<boolean>>) => {
    apiClient.put("/attack", {"attackedTrainerId":opposingTrainer.id.toString(),"dammage":"10"})
        .then((response) => {
            let attackResult : { "battle": Battle, "hpPointsPokemonsDuringBattle": {"pokemonId": number, "hp": number}[]} = response.data;
            updateBattleFunction({id: attackResult.battle.id, attackingTrainerId: attackResult.battle.attackingTrainerId, opposingTrainerId: attackResult.battle.opposingTrainerId, attackerPokemonId: attackResult.battle.attackerPokemonId, opponentPokemonId: attackResult.battle.opponentPokemonId, winner: attackResult.battle.winner});
            setHpPointsPokemonsDuringBattle(attackResult.hpPointsPokemonsDuringBattle);

            if (attackResult.battle.winner != -1) {
                setGameOver(true);
            }
        })
        .catch((error) => { alert(error); });
};

const battlePage = () => {
    let {userID} = useParams();

    let [currentTrainer, setCurrentTrainer] = React.useState<Trainer>(undefinedTrainer);
    let [opposingTrainer, setOpposingTrainer] = React.useState<Trainer>(undefinedTrainer);

    let [battle, setBattle] = React.useState<Battle>(undefinedBattle);
    let [isGameOver, setIsGameOver] = React.useState<boolean>(false);

    let [isCurrentTrainerTheAttacker, setIsCurrentTrainerTheAttacker] = React.useState<boolean>(false);
    let [hpPointsPokemonsDuringBattle, setHpPointsPokemonsDuringBattle] = React.useState<{"pokemonId": number, "hp": number}[]>([]);

    let intervalId : NodeJS.Timer = setInterval(()=> {}, 1000);

    // Run some additional code after React has updated the DOM (https://reactjs.org/docs/hooks-effect.html)
    useEffect( ()=> {
        if(typeof userID != "undefined"){
            const userIdInt = parseInt(userID);

            if (isNaN(userIdInt)) {
                alert("User id is not a valid number");
            } else {
                apiClient.get("/seealllog")
                    .then( (response) => {
                        const allUsers : User[] = response.data;

                        let user : User = undefinedUser;
                        let trainer : Trainer = undefinedTrainer;
                        let trainer2 : Trainer = undefinedTrainer;

                        allUsers.forEach((element) => { if (element.id == userIdInt) user = element; } )

                        if (user.trainer == null) {
                            alert("null pbm");
                        } else {
                            setCurrentTrainer(user.trainer);
                            trainer = user.trainer;
                        }

                        apiClient.get("/battles")
                            .then((response) => {
                                const allBattles : Battle[] = response.data;

                                let currentBattleIndex : number = -1;
                                for(let i = 0 ; i < allBattles.length ; i++) {
                                    if ( (allBattles[i].attackingTrainerId == trainer.id || allBattles[i].opposingTrainerId == trainer.id) && allBattles[i].winner == -1) {
                                        currentBattleIndex = i;
                                        break;
                                    }
                                }

                                if (currentBattleIndex != -1) {
                                    setBattle(allBattles[currentBattleIndex]);

                                    let trainer2Id = (trainer.id == allBattles[currentBattleIndex].opposingTrainerId) ? allBattles[currentBattleIndex].attackingTrainerId : allBattles[currentBattleIndex].opposingTrainerId;

                                    allUsers.forEach((element) => { if (element.trainer != null && element.trainer.id == trainer2Id) trainer2 = element.trainer; });

                                    if (trainer2.id == -1) {
                                        alert();
                                    } else {
                                        setOpposingTrainer(trainer2);
                                    }

                                    if (trainer.id == allBattles[currentBattleIndex].attackingTrainerId) {
                                        setIsCurrentTrainerTheAttacker(true);
                                    }
                                } else {
                                    apiClient.post("/CreateBattle",  {"trainerId": trainer.id.toString()})
                                        .then((response)=>{
                                            const newBattle : Battle = response.data;

                                            setIsCurrentTrainerTheAttacker(true);
                                            setBattle(newBattle);

                                            let trainer2Id = newBattle.opposingTrainerId;

                                            allUsers.forEach((element) => { if (element.trainer != null && element.trainer.id == trainer2Id) trainer2 = element.trainer; });

                                            if (trainer2.id == -1) {
                                                alert("pbmm");
                                            } else {
                                                setOpposingTrainer(trainer2);
                                            }

                                        })
                                        .catch((error)=>{ alert(error); });
                                }

                                clearInterval(intervalId);
                                intervalId = setInterval(async () => {
                                    let response = await apiClient.get("/battles");
                                    const allBattles : Battle[] = response.data;
                                    let currentBattleIndex = -1;
                                    for(let i = 0 ; i < allBattles.length ; i++) {
                                        if ( (allBattles[i].attackingTrainerId == trainer.id || allBattles[i].opposingTrainerId == trainer.id) && allBattles[i].winner == -1) {
                                            currentBattleIndex = i;
                                            break;
                                        }
                                    }

                                    setBattle((currentBattleIndex != -1) ? allBattles[currentBattleIndex] : battle);

                                    if(currentBattleIndex == -1)
                                        setIsGameOver(true);
                                    else
                                        setIsGameOver(false);

                                    response = await apiClient.put("/attack", {"attackedTrainerId":trainer2.id.toString(),"dammage":"0"});
                                    let attackResult : { "battle": Battle, "hpPointsPokemonsDuringBattle": {"pokemonId": number, "hp": number}[]} = response.data;
                                    setHpPointsPokemonsDuringBattle(attackResult.hpPointsPokemonsDuringBattle);
                                } , 1000);

                                if (battle.winner != -1) {
                                    clearInterval(intervalId);
                                }

                            })
                            .catch( (error) => { alert(error); });
                    })
                    .catch( (error) => { alert(error); });
            }
        } else {
            alert("User id is undefined");
        }

        // Avoid memory leaks by cleaning up the interval whenever the component re-renders or unmounts
        // Source : https://rapidapi.com/guides/api-requests-intervals
        return () => {
            clearInterval(intervalId);
        };

    },[]);


    return (
        <Container maxWidth="70%" style={pageStyles.page}>
            <Typography variant="h1" style={pageStyles.h1}>
                Champ de bataille
            </Typography>
            <Grid container spacing={3} style={pageStyles.container} >
              <Grid item xs={12} md={4}>
                <div style={pageStyles.box}>
                  <Typography variant="h3" style={pageStyles.h3}>
                    Vous
                  </Typography>
                    <TrainerPokemonList battle={battle} trainer={currentTrainer} isTheAttacker={isCurrentTrainerTheAttacker} />
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div style={pageStyles.box}>
                  <Typography variant="h3" style={pageStyles.h3}>
                      Actions
                  </Typography>
                    <div style={pageStyles.divForButton}>
                        <ColorfulButton
                            backgroundSize='cover'
                            border='2px solid red'
                            fontFamily ='Verdana, sans-serif'
                            animation = "change-image 3s ease-in-out infinite"
                            background = "url('https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/image3.gif')"
                            text="Attack !"
                            backgroundColor="#0e0d0d"
                            textColor="#fff"
                            display = {(isGameOver) ? "none" : "block"}
                            onClick={()=> { if(!isGameOver) handleClick(opposingTrainer, setBattle, setHpPointsPokemonsDuringBattle, setIsGameOver); }}
                        />
                    </div>
                    <BattleField battle={battle} currentTrainer={currentTrainer} opposingTrainer={opposingTrainer} isTheAttacker={!isCurrentTrainerTheAttacker} hpPointsPokemonsDuringBattle={hpPointsPokemonsDuringBattle} />
                    {(isGameOver)? <h1>Game over !</h1> : ""}
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div style={pageStyles.box}>
                  <Typography variant="h3" style={pageStyles.h3}>
                      Adversaire
                  </Typography>
                    <TrainerPokemonList battle={battle} trainer={opposingTrainer} isTheAttacker={!isCurrentTrainerTheAttacker} />
                </div>
              </Grid>
            </Grid>
            
          </Container>

      
    );
};

export default battlePage;
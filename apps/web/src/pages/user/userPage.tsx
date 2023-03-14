import React, { useState, useEffect , useRef} from "react";
import { useParams } from "react-router-dom";
import axios from "../../api";
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { Container, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import ApiServeur from "../../api";


import { useNavigate } from 'react-router-dom'

import "./user.scss"

interface Trainer {
    id: number;
    name: string;
    image: string;
}


interface Pokemon {
  id: number;
  name: string;
  image: string;
};

interface TrainerProps {
  trainer : Trainer[] | null
  setTrainer: (trainer: Trainer[] | null) => void;
}

interface PokemonProps {
  pokemons: Pokemon[] | null;
  setPokemons: (pokemons: Pokemon[] | null) => void;
}
const useStyles = makeStyles({
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

const Trainer: React.FC<TrainerProps> = ({ trainer, setTrainer }) => {
  const classes = useStyles();
  const removeSelected = (id: number) => {
    if(trainer){
      setTrainer(trainer.filter((item) => item.id !== id));
    }
  };
  return (
  <div>
  <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
    {trainer?.map( item  => ( 
    <li style={{ 
        display: 'flex', 
        alignItems: 'center',
        backgroundColor: 'white',
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
        height: '60px',
        paddingLeft: '20px',
        paddingRight: '20px',
        margin: '10px'
      }}>
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{item?.name}</h2>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>Trainer</p>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Avatar className={classes.image} style={{ marginRight: '10px' }}>
          <img src={item?.image} alt={item?.name} />
        </Avatar>
        <button style={{ 
            backgroundColor: '#ff6666', 
            border: 'none', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '5px',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }} onClick={() => removeSelected(item.id)}>Supprimer</button>
      </div>
    </li>))}
  </ul>
</div>

  );
};

const PokemonList: React.FC<PokemonProps> = ({ pokemons, setPokemons }) => {
  const removeSelected = (id: number) => {
    if(pokemons){
      setPokemons(pokemons.filter((item) => item.id !== id));
    }
  };
  const classes = useStyles();
  return (
    <div style={{border: "1px solid #ccc", borderRadius: "10px"}}>
    <ul style={{ listStyleType: 'none', margin: 0, padding: 0, height: '200px', overflow: 'auto' }} >
    {pokemons?.map(pokemon => (
      <li key={pokemon.id} style={{ 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: pokemon.id % 2 === 0 ? 'lightgray': 'white',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
          borderRadius: '5px',
          height: '60px',
          paddingLeft: '20px',
          paddingRight: '20px',
          margin: '10px'
        }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{pokemon?.name}</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>pokemon</p>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Avatar className={classes.image} style={{ marginRight: '10px' }}>
            <img src={pokemon?.image} alt={pokemon?.name} />
          </Avatar>
          <button style={{ 
              backgroundColor: '#ff6666', 
              border: 'none', 
              color: 'white', 
              padding: '10px 20px', 
              borderRadius: '5px',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }} onClick={() => removeSelected(pokemon.id)}>Supprimer</button>
        </div>
      </li> ))}
    </ul>
  </div>
  );
};

const TrainerAndPokemon: React.FC<TrainerProps & PokemonProps> = ({ trainer, pokemons, setPokemons, setTrainer }) => {
  return (
    <div>
      <Trainer trainer={trainer} setTrainer={setTrainer} />
      <PokemonList pokemons={pokemons} setPokemons={setPokemons} />
    </div>
  );
};

//export default TrainerAndPokemon;

//fin
interface Item {
  id: number;
  value: string;
  selected: boolean;
  image: string;
  description: string;
}

interface GereLaListe {
  items: Item[] ;
  setItems: (item: Item[]) => void;
  itemsPokemon?: Pokemon[] | null;
  itemsTrainers?: Trainer[] | null;
  setitemsPokemon?: (itemsPokemon: Pokemon[] | null) => void;
  setitemsTrainers?: (itemsTrainers: Trainer[] | null ) => void;
  Type : string;
  userId: number;
}
const ItemList: React.FC<GereLaListe> = ({items, setItems, itemsPokemon, itemsTrainers, setitemsPokemon,setitemsTrainers,Type,userId}) => {

  const navigate = useNavigate();
 
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [background, setBacground] = useState<string>("");
  const [backgroundPosition, setBackgroundPosition] = useState<string>('0 0');

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundPosition(prevBackgroundPosition => {
        const [x, y] = prevBackgroundPosition.split(' ').map(parseFloat);
        return `${x + 1}px ${y + 1}px`;
      });
    }, 1);
    return () => clearInterval(interval);
  }, []);


  const toggleSelection = (id: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, selected: !item.selected };
        }
        return { ...item, selected: false };
      })
    );
    setSelectedItem(items.find((item) => item.id === id));
    let concat : string = "url('"+items.find((item) => item.id ===id)?.image+"')"
    console.log("concat vaut "+concat)
    setBacground(concat);
  };

  const redirection = () =>{

    if( Type === "Pokémons"){
      navigate('/pokemon/'+userId);
    }else
    {
      navigate('/trainer/'+userId);
    }
    
  }
  const removeSelected = () => {
    //setItems(items.filter((item) => !item.selected));
    
    if (itemsTrainers && setitemsTrainers ){
      if(selectedItem){
        
         if (itemsTrainers.length === 1){
          const myTrainer = itemsTrainers.slice();
          myTrainer [0] = {
            id : selectedItem.id,
            name: selectedItem.value,
            image: selectedItem.image
          };
          setitemsTrainers(myTrainer);
         }else{
          const trainer: Trainer = {
            id : selectedItem.id,
            name: selectedItem.value,
            image: selectedItem.image
          }
          setitemsTrainers([...itemsTrainers, trainer]);
         }   
      }
      
    }else if (itemsPokemon && setitemsPokemon){
     
      if(selectedItem){
        const isExists = itemsPokemon.find((item) => item.id === selectedItem.id);
        if(isExists){
           alert( "Vous avez déjà choisi le Pokémon "+selectedItem.value)
        }else{
          const mypokemon: Pokemon ={
            id : selectedItem.id,
            name: selectedItem.value,
            image: selectedItem.image
          };

          setitemsPokemon([...itemsPokemon, mypokemon]);
          console.log(itemsPokemon);
      }
      }

    }

    setSelectedItem(null);
  };

  return (
    <React.Fragment>
      <CSSTransition
        in={selectedItem !== null}
        timeout={1}
        classNames="selected-item-transition"
        unmountOnExit
      >
        <React.Fragment>
        {selectedItem && <SelectedItem item={selectedItem} />}
        </React.Fragment>
      </CSSTransition>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, height: '100px', overflow: 'auto'  }}>
      {(items?.length === 0 || items === null )&& <p style={ { backgroundColor: 'red'}}>Vous n'avez pas des {Type} , Veuillez cliquer sur le lien ci-dessous afin d'ajouter des {Type} .</p>}
        {items.map((item, index) => (
          <ListItem key={item.id} item={item} index={index} toggleSelection={toggleSelection} />
        ))}
      
      </ul>
      
      
      {(items?.length !== 0  ) ?
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
                
                <ColorfulButton backgroundPosition={backgroundPosition} opacity={1} backgroundSize='contain' background= {background} text="Ajouter Dans votre liste" backgroundColor="#0c130c" textColor="#0c130c" onClick={removeSelected} />
        </div>
        :
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>  
        <ColorfulButton backgroundPosition={backgroundPosition} opacity={1} backgroundSize='contain' background= {background} text={"Veuillez Ajouter des "+Type+" "} backgroundColor="#0c130c" textColor="#0c130c" onClick={redirection} />
        </div>
       }
    </React.Fragment>
  );
};

interface ListItemProps {
  item: Item;
  index: number;
  toggleSelection: (id: number) => void;
}

const ListItem: React.FC<ListItemProps> = ({ item, toggleSelection, index }) => {
  return (
    <li key={index} style={{ backgroundColor: index % 2 === 0 ? 'lightgray' : 'white', height: '30px', width: '100%' , paddingLeft: "10%", paddingRight: "10%", paddingTop:"5px",  paddingBottom:"5px%"}}>
      <code style={{ float: 'left' }} >{item.value + " "}</code>
      <code style={{ float: 'right' }}>
        {/* <input type="checkbox" checked={item.selected} onChange={() => toggleSelection(item.id)} />  */}
        <label style={{ position: 'relative', cursor: 'pointer' }}>
              {/* <input type="checkbox" style={{ opacity: 0, position: 'absolute', top: 0, left: 0 }} /> */}
              <input type="checkbox" checked={item.selected} onChange={() => toggleSelection(item.id)} style={{ opacity: 0, position: 'absolute', top: 0, left: 0 }} />
              <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '1px solid gray', borderRadius: '5px', position: 'relative' }}>
                <span style={{ display: 'block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'lightgray', position: 'absolute', top: '5px', left: '5px' }} />
              </span>
            </label>
      </code>
    </li>
  );
};

const SelectedItemContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin-top: 20px;

img {
  width: 200px;
  height: 200px;
}

p {
  font-size: 18px;
  margin-top: 10px;
}
`;

const SelectedItem: React.FC<{ item: Item }> = ({ item }) => {

  return (
   
    <SelectedItemContainer>
      {console.log("image urlisis "+item.image)}
      <img src={item.image} alt={item.value} />
      <p>{item.description}</p>
    </SelectedItemContainer>
  );
};


//fin 
//bouton 

interface Props {
  text: string;
  backgroundColor?: string;
  textColor?: string;
  background?: string;
  animation?: string;
  fontFamily?: string;
  border?: string;
  backgroundSize: string;
  backgroundPosition?: string;
  opacity?:number ;

  onClick?: () => void;
}

const ColorfulButton: React.FC<Props> = ({backgroundPosition, opacity, backgroundSize, border ='none', text, backgroundColor = '#000', textColor = '#fff', background ,onClick ,animation, fontFamily}) => {
   const[localbackground, setLocalBackgroude] = useState(background)
  useEffect(() => {
     console.log('value of background has changed to :', background)
     setLocalBackgroude(background)
  },[background]);
  return (
    <button
      style={{
       // backgroundPosition,
        opacity,
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
        fontWeight: 'bold'
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


//fin de bouto 

type User = {
  userId : string,
}



interface IPokemon {
  id: number;
  pokedex: number;
  name: string;
  exp: number;
  level: number;
  statsId: number;
  itemId: number;
  userId: number;
  item: {
    itemId: number;
    name: string;
    effect: number;
    userId: number;
  };
  moves: {
    moveId: number;
    name: string;
    damage: number;
    pokemonId: number;
  }[];
  stats: {
    statsId: number;
    attack: number;
    hp: number;
  };
}

const userPage = () => {
     let {userID} = useParams();
     const [user, getUser] = useState<User>({userId : userID});
     const [AllPOkemons, setAllPOkemons] = useState<IPokemon[] | null>([]);
     const [pokemons, setPokemons] = useState<Item[]>([ ]);
     
     useEffect(() => {      
          ApiServeur.post("/pokemons",user).then((response) => {
            const data = response.data;
            const allpokemons = data.map((pok: any) => {
              return {
                id: pok.id,
                pokedex: pok.pokedex,
                name: pok.name,
                exp: pok.exp,
                level: pok.level,
                statsId: pok.statsId,
                itemId: pok.itemId,
                userId: pok.userId,
                item: {
                  itemId: pok.item.itemId,
                  name: pok.item.name,
                  effect: pok.item.effect,
                  userId: pok.item.userId,
                },
                moves: pok.moves.map((move: any) => ({
                  moveId: move.moveId,
                  name: move.name,
                  damage: move.damage,
                  pokemonId: move.pokemonId,
                })),
                stats: {
                  statsId: pok.stats.statsId,
                  attack: pok.stats.attack,
                  hp: pok.stats.hp,
                },
              };
            });
            setAllPOkemons(allpokemons);   
            // const pokshoe = data.map((pok: any) => {

            //     let  spriteUrl ="spriteUrlNotFind";
            //     axios
            //     .get("https://pokeapi.co/api/v2/pokemon/"+pok.name)
            //     .then(response => {
            //        spriteUrl = response.data.sprites.front_default;
            //     })
            //     return {
            //       id: pok.id,
            //       value: pok.name,
            //       selected: false,
            //       image: spriteUrl,
            //       description: "Level: "+pok.level +" Item Name : "+ pok.item.name+ " Item Effect "+pok.item.effect +" attack : "+pok.stats.attack+" hp : "+pok.stats.hp+" ",
            //     }
            // }); 
            const fetchData = async () => {
              const promises = data.map(async (pok: any) => {
                try {
                  const response = await axios.get("https://pokeapi.co/api/v2/pokemon/" + pok.name);
                  const spriteUrl = response.data.sprites.front_default;
                  const description = "Level: " + pok.level + " Item Name : " + pok.item.name + " Item Effect " + pok.item.effect + " attack : " + pok.stats.attack + " hp : " + pok.stats.hp + " ";
                  return {
                    id: pok.id,
                    value: pok.name,
                    selected: false,
                    image: spriteUrl,
                    description: description,
                  }
                } catch (error) {
                  console.error(error);
                  return null;
                }
              });
              const results = await Promise.all(promises);
              const filteredResults = results.filter((result) => result !== null);
              setPokemons(filteredResults);
            }
            
            //useEffect(() => {
              fetchData();
           // }, []);
            
            
            //setPokemons(pokshoe);
        }).catch(error => {
          console.log("Aucun donner n'a ete charger"+error);
        });
      }, []);
    //  //bouton 

    // useEffect(() => {
    //   const fetchImages = async () => {
    //     const promises = pokemons.map((pok) =>
    //       axios
    //         .get(`https://pokeapi.co/api/v2/pokemon/${pok.name}`)
    //         .then((response) => response.data.sprites.front_default)
    //         .catch(() => "")
    //     );
    
    //     const spriteUrls = await Promise.all(promises);
    
    //     const updatedPokemons = pokemons.map((pok, index) => ({
    //       ...pok,
    //       image: spriteUrls[index],
    //     }));
    
    //     setPokemons(updatedPokemons);
    //   };
    
    //   fetchImages();
    // }, []);
   

    // useEffect(() => {
    //   const fetchImages = () => {
    //     pokemons.forEach(pok => {
    //       axios
    //         .get("https://pokeapi.co/api/v2/pokemon/"+pok.value)
    //         .then(response => {
    //           const spriteUrl = response.data.sprites.front_default;
    //           console.log("image sprite url "+spriteUrl);
    //           setPokemons(prevState => {
    //             const updatedPokemons = [...prevState];
    //             const index = updatedPokemons.findIndex(p => p.value === pok.value);
    //             updatedPokemons[index].image = spriteUrl;
    //             return updatedPokemons;
    //           });
    //         })
    //         .catch(() => {
    //           console.log("image not find ");
    //           setPokemons(prevState => {
    //             const updatedPokemons = [...prevState];
    //             const index = updatedPokemons.findIndex(p => p.value === pok.value);
    //             updatedPokemons[index].image = "";
    //             return updatedPokemons;
    //           });
    //         });
    //     });
    //   };
    
    //   fetchImages();
    // }, []);
    

     const handleClick = () => {
      
     };

 
  const [Trainer, setTrainer] = useState<Item[]>([
    { id: 1, value: 'Ismail  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/ali.jpg', description: '15 ans expérience' },
    { id: 2, value: 'Ali  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/atteyeh.png', description: '14 ans expérience ' },
    { id: 3, value: 'Omar  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/ismail.webp', description: '19 ans expérience ' },
    { id: 4, value: 'Atteyeh  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/omar.png', description: '5 ans expérience ' },
  ]);

  const [pokemonsChoised, setPokemonsChoised] = useState<Pokemon[] | null>([]);
  const [TrainerChoisied, setTrainerChoised] = useState<Trainer[] | null >([]);


     //fin de bouton 
     const styles = {
      page:{
        backgroundColor: "#807272",
        marginLeft: "auto",
        marginRight: "auto",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px 0px #ccc",
        overflow:"auto",
        height: "100vh",
        marginTop: "20px",
        paddingTop: "10px",
        background: `url('https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/image1.gif')`,
        //animation: 'change-image 3s ease-in-out infinite',
      },
      container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        marginTop: "40px",
        marginLeft: "auto",
        marginRight: "auto",
      },
      box: {
        maxHeight: "50vh",
        minHeight: "50vh",
        marginRight: "5px",
        backgroundColor: "#f2f2f2",
        //minWidth: "50vh",
        padding: "20px",
        border: "1px solid #333",
        borderRadius: "15px",
        textAlign: "center",
        boxShadow: "0px 10px 20px 2px rgba(0,255,255,0.7)",
        marginBottom: "20px",
        overflow: "auto",
        marginLeft: "5px",
        transition: "all ease 0.2s",
        transform: "translateY(-5px)",
      },
      h3: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "10px"
      },
      button: {
        backgroundColor: "#4caf50",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        textDecoration: "none",
        cursor: "pointer",
        marginRight: "10px"
      },
      h1: {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "10px",
        textAlign: "center",
        backgroundColor: "#7dee6e",
      }
    };
    
     useEffect(()=> {
        if(userID){
            const url = "/searchUser/"+userID;
           
            axios.get(url).then((response) =>{
                if(response.status === 200){
                    getUser(response.data);
                }else{
                    getUser(null)
                    console.error("La requête a échoué avec le statut : ", response.status); 
                }
                
            }).catch((error) => {
                console.error("Une erreur s'est produite lors de la requête : ", error);
              });
        }
     },[]);
    
     console.log("valeur user "+user);
    return (
        <Container maxWidth="lg" style={styles.page}>
            <Typography variant="h1" style={styles.h1}>
              Bonjour , Merci de créez votre équipe en fonction de vos préférences.
            </Typography>
            <Grid container spacing={3} style={styles.container} >
              <Grid item xs={12} md={4}>
                <div style={styles.box}>
                  <Typography variant="h3" style={styles.h3}>
                    Sélectionner un Dresseur
                  </Typography>
                  <ItemList items={Trainer} setItems={setTrainer} itemsTrainers={TrainerChoisied} setitemsTrainers={setTrainerChoised} Type="Dresseurs" userId={parseInt(user.userId, 10)}/>
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div style={styles.box}>
                  <Typography variant="h3" style={styles.h3}>
                    Choisir des pokémons
                  </Typography>
                  <ItemList items={pokemons} setItems={setPokemons} itemsPokemon={pokemonsChoised} setitemsPokemon={setPokemonsChoised} Type="Pokémons" userId={parseInt(user.userId, 10)}/>
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div style={styles.box}>
                  <Typography variant="h3" style={styles.h3}> 
                    Votre Équipe
                    { <TrainerAndPokemon trainer={TrainerChoisied} pokemons={pokemonsChoised} setPokemons={setPokemonsChoised} setTrainer={setTrainerChoised} /> }
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
                      <ColorfulButton
                        backgroundSize='cover'
                        border='2px solid red'
                        fontFamily ='Verdana, sans-serif'
                        animation = "change-image 3s ease-in-out infinite"
                        background = "url('https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/image3.gif')"
                        text="Créez votre équipe."
                        backgroundColor="#0e0d0d"
                        textColor="#fff"
                        onClick={handleClick}
                      />
                    </div>
                  </Typography>
                  
                </div>
              </Grid>
            </Grid>
            
          </Container>

      
    );
};


  export default userPage;
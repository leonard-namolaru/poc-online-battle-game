import React, { useState, useEffect , useRef} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

import "./user.scss"


interface Trainer {
    id: number;
    name: string;
    image: string;
}


interface pokemon {
  id: number;
  name: string;
  image: string;
};

interface TrainerProps {
  trainer : Trainer
  deleteTrainer: (id: string) => void;
}

interface PokemonProps {
  pokemons: pokemon[] ;
  setPokemons: (pokemons: pokemon[]) => void;
}

const Trainer: React.FC<TrainerProps> = ({ trainer, deleteTrainer }) => {
  return (
    <div>
      <h2>{trainer.name}</h2>
      <img src={trainer.image} alt={trainer.name} />
      <button onClick={() => deleteTrainer(trainer.id)}>Supprimer</button>
    </div>
  );
};

const PokemonList: React.FC<PokemonProps> = ({ pokemons, setPokemons }) => {
  const [selectedPokemons, setselectedPokemons] = useState<pokemon | null>(null);
  const toggleSelection = (id: number) => {
    setselectedPokemons(pokemons?.find((item) => item?.id === id));
  };
  return (
    <ul>
      {pokemons.map(pokemon => (
        <li key={pokemon.id}>
          <h3>{pokemon.name}</h3>
          <img src={pokemon.image} alt={pokemon.name} />
          <button onClick={() => deletePokemon(pokemon.id)}>Supprimer</button>
        </li>
      ))}
    </ul>
  );
};

const TrainerAndPokemon: React.FC<{trainer: TrainerProps; pokemonList: PokemonProps[]; deletePokemon: (id: string) => void;deleteTrainer: (id: string) => void;}> = ({ trainer, pokemonList, deletePokemon, deleteTrainer }) => {
  return (
    <div>
      <Trainer trainer={trainer} deleteTrainer={deleteTrainer} />
      <PokemonList pokemonList={pokemonList} deletePokemon={deletePokemon} />
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
}
const ItemList: React.FC<GereLaListe> = ({items, setItems}) => {
  // const [items, setItems] = useState<Item[]>([
  //   { id: 1, value: 'Pikachu  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/pikachu-3865521_960_720.png', description: 'Pikachu de ' },
  //   { id: 2, value: 'Rattatac  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/Rattatac.png', description: 'Rattatac de ' },
  //   { id: 3, value: 'Pulpizarre  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/pulpizarre.png', description: 'Pulpizarre de ' },
  //   { id: 4, value: 'Salmeche  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/salmeche.png', description: 'Salmeche de ' },
  // ]);

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

  const removeSelected = () => {
    setItems(items.filter((item) => !item.selected));
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
      
        {items.map((item, index) => (
          <ListItem key={item.id} item={item} index={index} toggleSelection={toggleSelection} />
        ))}
      
      </ul>
      
        {/* <button onClick={removeSelected}>Prendre</button> */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
                
                <ColorfulButton backgroundPosition={backgroundPosition} opacity={1} backgroundSize='contain' background= {background} text="Ajouter Dans votre liste" backgroundColor="#0c130c" textColor="#0c130c" onClick={removeSelected} />
        </div>
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

const SelectedItem: React.FC<{ item: Item }> = ({ item }) => {
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

  return (
    <SelectedItemContainer>
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
        backgroundPosition,
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
    id: number,
    name: string,
    pwd: string,
    email: string,
}

const userPage = () => {
     let {userID} = useParams();
     const [user, getUser] = useState<User | null | String>();

     //bouton 
     const [counter, setCounter] = useState(0);
     const handleClick = () => {
       setCounter(prevCounter => prevCounter + 1);
     };

  const [pokemons, setPokemons] = useState<Item[]>([
    { id: 1, value: 'Pikachu  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/pikachu-3865521_960_720.png', description: 'Pikachu de ' },
    { id: 2, value: 'Rattatac  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/Rattatac.png', description: 'Rattatac de ' },
    { id: 3, value: 'Pulpizarre  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/pulpizarre.png', description: 'Pulpizarre de ' },
    { id: 4, value: 'Salmeche  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/salmeche.png', description: 'Salmeche de ' },
  ]);
  const [Trainer, setTrainer] = useState<Item[]>([
    { id: 1, value: 'Ismail  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/ali.jpg', description: '15 ans expérience' },
    { id: 2, value: 'Ali  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/atteyeh.png', description: '14 ans expérience ' },
    { id: 3, value: 'Omar  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/ismail.webp', description: '19 ans expérience ' },
    { id: 4, value: 'Atteyeh  ', selected: false, image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/omar.png', description: '5 ans expérience ' },
  ]);

  const [pokemonsChoised, setPokemonsChoised] = useState<pokemon[]>([
    { id: 1, name: 'Pikachu  ',  image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/pikachu-3865521_960_720.png' },
    { id: 2, name: 'Rattatac  ',  image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/Rattatac.png'  },
    { id: 3, name: 'Pulpizarre  ',  image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/pulpizarre.png'  },
    { id: 4, name: 'Salmeche  ',  image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/salmeche.png'  },
  ]);
  const [TrainerChoisied, setTrainerChoised] = useState<Trainer>(
    { id: 1, name: 'Ismail  ', image: 'https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/ali.jpg' }
  );


     //fin de bouton 
     const styles = {
      page:{
        backgroundColor: "#807272",
        marginLeft: "20px",
        marginRight: "20px",
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
        //width: "100%",
        height: "60vh",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px 0px #ccc",
        padding: "20px",
        backgroundColor: "#a09898",
        marginLeft: "20px",
        marginRight: "20px",
        marginTop: "40px",
        overflow:"auto",
        background: `url('https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/image1.gif')`,
        
      },
      box: {

        maxHeight: "50vh",
        minHeight: "50vh",
        backgroundColor: "#f2f2f2",
        minWidth: "50vh",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0px 0px 10px 0px #ccc",
        marginBottom: "20px",
        overflow: "auto",
        marginLeft: "20px",
        
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
            const url = "http://localhost:3000/searchUser/"+userID;
           
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
        
        <div>
         {/* {user == null ?(
              <h3>L'utilisateur n'est pas identifié où il y a une erreur de connexion</h3> 
         ) : ( */}
            <div style={styles.page}>
              {/* <h1  style={styles.h1}>Bonjour { user.name }, Merci de créez votre équipe en fonction de vos préférences.</h1> */}
              <h1  style={styles.h1}>Bonjour , Merci de créez votre équipe en fonction de vos préférences.</h1>

              <div style={styles.container}>
                {/* <TrainerList trainers={trainers} /> */}
                <div style={styles.box}>
                  <h3 style={styles.h3}>Sélectionner un Dresseur</h3>
                  <ItemList items={Trainer} setItems={setTrainer} />
                </div>
                <div style={styles.box}>
                  <h3 style={styles.h3}>Choisir des pokémons</h3>
                  <ItemList items={pokemons} setItems={setPokemons} />
                </div>
                <div style={styles.box}>
                    <h3 style={styles.h3}>Votre Équipe</h3>
                    {/* <TrainerAndPokemon trainer={TrainerChoisied} pokemonList={pokemonsChoised} /> */}
                </div>
              </div>
                   
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
                <ColorfulButton backgroundSize='cover' border='2px solid red' fontFamily ='Verdana, sans-serif' animation = "change-image 3s ease-in-out infinite" background = "url('https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/image3.gif')" text="Créez votre équipe." backgroundColor="#0e0d0d" textColor="#fff" onClick={handleClick} />
                {/* <div style={{ marginLeft: '20px' }}>Clicks: {counter}</div> */}
              </div>
             </div>
         {/* )} */}
                  
        </div>
      
    );
};


  export default userPage;
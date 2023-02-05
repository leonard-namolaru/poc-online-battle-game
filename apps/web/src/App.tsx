import React, {StrictMode} from "react";
import ReactDOM from "react-dom"
import {BrowserRouter, Routes , Route, Outlet, Link} from "react-router-dom"
import Home from "./pages/Home";
import Pokemon from "./pages/Pokemon";

import "./index.scss";

// const urlTrainerPost = "http://localhost:3000/trainers";
// type Trainer = {
//   name: string;
//   gender: string;
// };

// export type ListeTrainerForme = {
//   id: number;
//   name: string;
//   gender: string;
// };

// const App = () => {
//   const [trainers, gettrainers] = useState<ListeTrainerForme[] | null>();
//   useEffect(() => {
//     const url = "http://localhost:3000/trainers";
//     axios.get(url).then((response) => {
//       gettrainers(response.data);
//     });
//   }, []);

//   const [trainer, setTrainer] = useState<Trainer>({
//     name: "",
//     gender: "",
//   });

//   const setNewValue = (id_: string, newValue: string) =>
//     setTrainer((prevState) => ({ ...prevState, [id_]: newValue }));

//   const createTrainer = async () => {
//     try {
      // const response = await axios.post(urlTrainerPost, trainer);
//       alert(`The reponse is: ${response.data.id}`);
//     } catch (exception_) {
//       alert(`There was an error `);
//     }
//   };
//   return (
//     <div className="mt-10 text-3xl mx-auto max-w-6xl">
//       <div className="div1">
//         <h1>Liste des dresseurs : </h1>
//         {trainers
//           ? trainers.map((train) => {
//               return <p> {train.name}</p>;
//             })
//           : null}
//       </div>
//       <div className="div2">
//         <h1>Ajouter un dresseur : </h1>
//         <input
//           placeholder="name"
//           value={trainer.name}
//           onChange={(evt) => {
//             setNewValue("name", evt.target.value);
//           }}
//         />
//         <br />
//         <input
//           placeholder="gender"
//           value={trainer.gender}
//           onChange={(evt) => {
//             setNewValue("gender", evt.target.value);
//           }}
//         />
//         <br />
//         <button
//           onClick={() => {
//             createTrainer();
//           }}
//         >
//           Enregister
//         </button>
//       </div>
//     </div>
//   );
// };

// ReactDOM.render(<App />, document.getElementById("app"));



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

const App = () => {
  const [trainers, gettrainers] = useState<ListeTrainerForme[] | null>();
  useEffect(() => {
    const url = "http://localhost:3000/trainers";
    axios.get(url).then((response) => {
      gettrainers(response.data);
    });
  }, []);

  const [trainer, setTrainer] = useState<Trainer>({
    name: "",
    gender: "",
  });

  const setNewValue = (id_: string, newValue: string) =>
    setTrainer((prevState) => ({ ...prevState, [id_]: newValue }));

  const createTrainer = async () => {
    try {
      const response = await axios.post(urlTrainerPost, trainer);
      alert(`The reponse is: ${response.data.id}`);
    } catch (exception_) {
      alert(`There was an error `);
    }
  };
  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div className="div1">
        <h1>Liste des dresseurs : </h1>
        {trainers
          ? trainers.map((train) => {
              return <p> {train.name}</p>;
            })
          : null}
      </div>
      <div className="div2">
        <h1>Ajouter un dresseur : </h1>
        <input
          placeholder="name"
          value={trainer.name}
          onChange={(evt) => {
            setNewValue("name", evt.target.value);
          }}
        />
        <br />
        <input
          placeholder="gender"
          value={trainer.gender}
          onChange={(evt) => {
            setNewValue("gender", evt.target.value);
          }}
        />
        <br />
        <button
          onClick={() => {
            createTrainer();
          }}
        >
          Enregister
        </button>
      </div>
    </div>
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

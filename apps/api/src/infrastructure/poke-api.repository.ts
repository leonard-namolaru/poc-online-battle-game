import {IPokeApiRepository} from "../domain/interfaces";
import {PokemonClient, MoveClient} from "pokenode-ts";

export class PokeApiRepository implements IPokeApiRepository {
    private pokemonClient : PokemonClient;
    private moveClient : MoveClient;

    constructor() {
        this.pokemonClient = new PokemonClient();
        this.moveClient = new MoveClient();
    }



    async newPokemon(pokemonNameInEnglish : string) : Promise<{pokedex: number, name: string, stats: {attack: number, hp: number}, item: {name: string, effect: number}, moves: {name: string, damage: number}[], exp: number, level: number}> {
        let attackValue = 0;
        let hpValue = 0;

        try {
            const pokemonFromApi = await this.pokemonClient.getPokemonByName(pokemonNameInEnglish.toLowerCase());

            pokemonFromApi.stats.forEach(element => {
                if (element.stat.name == "attack")
                    attackValue = element.base_stat;
                else if (element.stat.name == "hp")
                    hpValue = element.base_stat;
            });

            let movesList: {name: string, damage: number}[] = new Array();

            for (let i = 0 ; i < pokemonFromApi.moves.length && i < 2 ; i++) {
                const moveName = pokemonFromApi.moves[i].move.name;
                let moveDamage = 0;

                const moveFromApi = await this.moveClient.getMoveByName(moveName);
                if (typeof moveFromApi.power == "number") // 'moveFromApi.power' is possibly 'null'
                    moveDamage = moveFromApi.power

                const newMove: {name: string, damage: number} = {name: moveName, damage: moveDamage};
                movesList.push(newMove)
            }

            return  {pokedex : pokemonFromApi.id,
                     name    : pokemonNameInEnglish.toLowerCase(),
                     stats   : {attack : attackValue, hp : hpValue},
                     item    : {name: "test", effect: 3},
                     exp     : pokemonFromApi.base_experience,
                     moves   : movesList,
                     level   : 0
            };
        } catch (error : any) {
            return Promise.reject("No data was found for the Pokemon name or there was a problem communicating with the PokeAPI : " + error);
        }
    }
}



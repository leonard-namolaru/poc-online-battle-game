import { describe, expect, expectTypeOf, test, beforeAll } from 'vitest';
import { PokemonTeamRepository } from "../../src/infrastructure/pokemon-team.repository";
import { initTrainerContainer } from "../../src/domain/trainer.container";
import { initPokemonContainer } from "../../src/domain/pokemon.container";
import { initUserContainer } from "../../src/domain/user.container";
import { PokeApiRepository } from "../../src/infrastructure/poke-api.repository"
import { Trainer, Item, Stats, User } from '../../src/domain/entities';

describe('PokemonTeam Repository - test', () => {
    const trainerContainer = initTrainerContainer();
    const pokemonContainer = initPokemonContainer();
    const userContainer = initUserContainer();
    const pokemonTeamRepository = new PokemonTeamRepository();
    const pokeApi = new PokeApiRepository();
    const givenUser = userContainer.createUserUsecase.execute({
        name: "testUserpokemonTeam",
        email:"test@testmail.fr",
        inscriptionDate: new Date(Date.now()),
        pwd:"test",
        AllMyPokemon:[]
    });

    let teamId = 0;

    beforeAll(async () => {
        const givenTortipouss = await pokeApi.newPokemon("Turtwig");
        const givenMoves = givenTortipouss.moves;
        const givenStats : Stats = givenTortipouss.stats;
        const givenItem : Item = {itemId: 1, name: "Pépite", effect:0};

        pokemonContainer.createPokemonUsecase.execute({pokedex:387, name:"Tortipouss", level:0, exp:0, moves:givenMoves, stats:givenStats, item:givenItem, userId:(await givenUser).id});    
        pokemonContainer.createPokemonUsecase.execute({pokedex:390, name:"Ouisticram", level:0, exp:0, moves:givenMoves, stats:givenStats, item:givenItem, userId:(await givenUser).id});    
        pokemonContainer.createPokemonUsecase.execute({pokedex:393, name:"Tiplouf", level:0, exp:0, moves:givenMoves, stats:givenStats, item:givenItem, userId:(await givenUser).id});    
        pokemonContainer.createPokemonUsecase.execute({pokedex:396, name:"Etourmi", level:0, exp:0, moves:givenMoves, stats:givenStats, item:givenItem, userId:(await givenUser).id});    
        pokemonContainer.createPokemonUsecase.execute({pokedex:399, name:"Keunotor", level:0, exp:0, moves:givenMoves, stats:givenStats, item:givenItem, userId:(await givenUser).id});    
        pokemonContainer.createPokemonUsecase.execute({pokedex:403, name:"Lixy", level:0, exp:0, moves:givenMoves, stats:givenStats, item:givenItem, userId:(await givenUser).id});    
    });

    test('#create', async () => {
        // GIVEN
        const givenTrainer : Trainer = 
            await trainerContainer.createTrainerUsecase.execute({
                name: "TotoTeam", gender: "f", userId:(await givenUser).id
            });

        // WHEN
        //const team = await pokemonTeamRepository.create(givenTrainer.id);

        // THEN
        /*expectTypeOf(team.teamId).toBeNumber();
        expectTypeOf(team.trainerId).toBeNumber();
        //expectTypeOf(team.trainer).toEqualTypeOf(givenTrainer);
        //expect(team.trainer).toEqual(givenTrainer);
        expect(team.pokemonList).toEqual([]);*/
        
        // Problème, car le usecase de création des Trainers créer déjà une équipe.
        expectTypeOf(givenTrainer.activeTeam.teamId).toBeNumber();
        expectTypeOf(givenTrainer.activeTeam.trainerId).toBeNumber();
        expect(givenTrainer.activeTeam.pokemonList).toEqual([]);

        teamId = givenTrainer.activeTeam.teamId;
    });

    test('#find', async () => {
        // GIVEN
        const givenTeamId = teamId;

        // WHEN
        const team = await pokemonTeamRepository.find(givenTeamId);

        // THEN
        expectTypeOf(team.teamId).toBeNumber();
        expect(team.teamId).toEqual(givenTeamId);
    });

    test('#addToTeam', async () => {
        // GIVEN
        const givenTeamId = teamId;
        const pokemons = await pokemonContainer.getAllPokemonsUsecase.execute();
        const givenPokemon = pokemons[0];
        
        // WHEN
        const team = await pokemonTeamRepository.find(givenTeamId);
        const modfiedTeam = await pokemonTeamRepository.addToTeam(team, givenPokemon.id);

        // THEN
        expect(modfiedTeam.teamId).toEqual(givenTeamId);
        if(modfiedTeam.pokemonList != null){
            expect(modfiedTeam.pokemonList.length).toEqual(1);
        }
        expect(modfiedTeam.pokemonList).toEqual([givenPokemon]);

    });

    test('#removeFromTeam', async () => {
        // GIVEN
        const givenTeamId = teamId;
        const pokemons = await pokemonContainer.getAllPokemonsUsecase.execute();
        const givenPokemon = pokemons[0];
        
        // WHEN
        const team = await pokemonTeamRepository.find(givenTeamId);
        const modfiedTeam = await pokemonTeamRepository.removeFromTeam(team, givenPokemon.id);

        // THEN
        expect(modfiedTeam.teamId).toEqual(givenTeamId);
        if(modfiedTeam.pokemonList != null){
            expect(modfiedTeam.pokemonList.length).toEqual(0);
        }
        expect(modfiedTeam.pokemonList).toEqual([]);

    });

    test('#addAndRemoveMultiple', async () => {
        // GIVEN
        const givenTeamId = teamId;
        const givenPokemons = await pokemonContainer.getAllPokemonsUsecase.execute();
        
        // WHEN
        const team = await pokemonTeamRepository.find(givenTeamId);
        let modfiedTeam = await pokemonTeamRepository.addToTeam(team, givenPokemons[2].id);
        modfiedTeam = await pokemonTeamRepository.addToTeam(team, givenPokemons[4].id);

        // THEN
        expect(modfiedTeam.teamId).toEqual(givenTeamId);
        if(modfiedTeam.pokemonList != null){
            expect(modfiedTeam.pokemonList.length).toEqual(2);
        }
        expect(modfiedTeam.pokemonList).toEqual([givenPokemons[2], givenPokemons[4]]);

        // WHEN
        modfiedTeam = await pokemonTeamRepository.removeFromTeam(team, givenPokemons[4].id);

        // THEN
        expect(modfiedTeam.teamId).toEqual(givenTeamId);
        if(modfiedTeam.pokemonList != null){
            expect(modfiedTeam.pokemonList.length).toEqual(1);
        }
        expect(modfiedTeam.pokemonList).toEqual([givenPokemons[2]]);

    });
})
import {User, Trainer, Battle, Pokemon, PokemonTeam} from "./entities";

export interface IUserRepository {
    create(User: {name: string, pwd: string, email: string,
    inscriptionDate: Date, AllMyPokemon: Pokemon[], uniqueToken: string, isValid: boolean}): Promise<User>;
    findAll(): Promise<User[]>
    find(UserId : number) : Promise<User>
    findMyUserwithLogin(email:string ,pwd:string): Promise<User>
    findUserToken(uniqueToken: string): User | PromiseLike<User>
    update(user: User): User | PromiseLike<User>;
}

export interface ITrainerRepository {
    create(trainer: { name: string, gender: string, userId: number  }): Promise<Trainer>;
    findAll(): Promise<Trainer[]>
    find(trainerId : number) : Promise<Trainer>
    update(trainer: {id: number, name: string, gender: string }): Promise<Trainer>
    delete(trainerId : number): Promise<Trainer>
}

export interface IPokemonRepository {
    create(pokemon: {pokedex: number, name: string, stats: {attack: number, hp: number}, item: {name: string, effect: number}, moves: {name: string, damage: number}[], exp: number, level: number, userId : number,types: {name: string}[]}): Promise<Pokemon>;
    findAll(): Promise<Pokemon[]>
    find(pokemonId : number) : Promise<Pokemon>
}

export interface IBattleRepository {
    create(battle: { attackingTrainerId: number,
                     opposingTrainerId: number,
                     attackerPokemonId : number,
                     opponentPokemonId : number,
                     winner: number }): Promise<Battle>;
    findAll(): Promise<Battle[]>
    find(battleId: number):  Promise<Battle>
    findActiveBattleWithTrainerId(trainerId: number): Promise<Battle>
    update(battle: Battle): Promise<Battle>
}

export interface IPokemonTeamRepository{
    create(trainerId: number): Promise<PokemonTeam>;
    findAll(): Promise<PokemonTeam[]>;
    find(teamId: number): Promise<PokemonTeam>;
    addToTeam(pokemonTeam: PokemonTeam, pid: number):Promise<PokemonTeam>;
    removeFromTeam(pokemonTeam: PokemonTeam, pid: number):Promise<PokemonTeam>;
}

export interface IPokeApiRepository{
    newPokemon(pokemonNameInEnglish : string) : Promise<{pokedex: number, name: string, stats: {attack: number, hp: number}, item: {name: string, effect: number}, moves: {name: string, damage: number}[], exp: number, level: number}>;
}
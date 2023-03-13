import { IPokemonTeamRepository } from "../domain/interfaces";
import {PokemonTeam} from "../domain/entities";
import { Pokemon } from "../domain/entities";
import { prisma } from "../../db";

export class PokemonTeamRepository implements IPokemonTeamRepository {

    /**
     * Build a PokemonTeam type as described in entities.ts.
     * @param teamId the teamId of the built team.
     * @param trainerId the trainerId of the built team. It will be used to populate the Trainer field.
     * @returns a pokemonTeam.
     */
    async buildPokemonTeamEntity(teamId: number, trainerId: number): Promise<PokemonTeam> {
        const trainer = await prisma.trainer.findFirst({
            where: {
                id: trainerId
            },
            include: {activeTeam: true},
        });
        if (trainer === null) {
            return Promise.reject("Provided Trainer id does not exist !");
        }

        // Query DB to find all pokemon belonging to the given team.
        const pokemonOnPokemonTeams = await prisma.pokemonOnPokemonTeams.findMany({
            where: {
                pokemonTeamId: teamId
            },
            orderBy: {
                pokemonTeamId: 'asc' // Preserve the order of addition to a team. Will be removed when position in teams will be implemented.
            }
        });

        // Filling the list of pokemon.
        const pkmnList: Pokemon[] = [];
        if (pokemonOnPokemonTeams !== null) {
            for (let index = 0; index < pokemonOnPokemonTeams.length; index++) {
                const pkmn = await prisma.pokemon.findUnique({
                    where: {
                        id: pokemonOnPokemonTeams[index].pid
                    },
                    include : {
                        item : true,
                        moves : true,
                        stats : true,
                        types: true,
                    }
                });
                if (pkmn) { // Needed to ensure a valid pokemon object is used.
                    pkmnList.push(pkmn);
                }
            }
        }


        return { teamId: teamId, trainerId : trainerId, pokemonList: pkmnList };
    }

    async create(trainerId: number): Promise<PokemonTeam> {
        const pokemonTeam = await prisma.pokemonTeam.create({
            data: {
                trainerId: trainerId,
                pokemonList: {}
            }
        });
        return this.buildPokemonTeamEntity(pokemonTeam.teamId, pokemonTeam.trainerId);
    }

    async findAll(): Promise<PokemonTeam[]> {
        const pokemonTeams = await prisma.pokemonTeam.findMany();
        if (pokemonTeams === null) {
            return Promise.reject("No pokemonTeams in DB.");
        }
        let pokemonTeamsReturned: PokemonTeam[] = [];
        for (let i = 0; i < pokemonTeams.length; i++) {
            const team = pokemonTeams.at(i);
            if (team !== undefined) {
                const teamReturned = await this.buildPokemonTeamEntity(team.teamId, team.trainerId);
                pokemonTeamsReturned.push(teamReturned);
            }
        }
        return pokemonTeamsReturned;
    }

    async find(teamId: number): Promise<PokemonTeam> {
        const pokemonTeam = await prisma.pokemonTeam.findFirst({
            where: {
                teamId: teamId
            }
        });
        if (pokemonTeam === null) {
            return Promise.reject("PokemonTeam was not in DB.");
        }
        return await this.buildPokemonTeamEntity(pokemonTeam.teamId, pokemonTeam.trainerId);
    }

    async addToTeam(pokemonTeam: PokemonTeam, pid: number): Promise<PokemonTeam> {
        const add = await prisma.pokemonOnPokemonTeams.create({
            data: {
                pokemonTeamId:pokemonTeam.teamId,
                pid: pid
            }
        });
        if (add === null) {
            return Promise.reject("Error while adding pokemon in team");
        }
        return await this.buildPokemonTeamEntity(pokemonTeam.teamId, pokemonTeam.trainerId);
    }

    async removeFromTeam(pokemonTeam: PokemonTeam, pid: number): Promise<PokemonTeam> {
        const remove = await prisma.pokemonOnPokemonTeams.delete({
            where: {
                pid_pokemonTeamId:{pid: pid, pokemonTeamId: pokemonTeam.teamId}
            },
        });
        if (remove === null) {
            return Promise.reject("Error while removing pokemon in team");
        }
        return await this.buildPokemonTeamEntity(pokemonTeam.teamId, pokemonTeam.trainerId);
    }
}
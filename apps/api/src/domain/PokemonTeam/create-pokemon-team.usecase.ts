import { PokemonTeam } from "../entities";
import { IPokemonTeamRepository } from "../interfaces";

export class CreatePokemonTeamUsecase {
    private teamRepository: IPokemonTeamRepository;

    constructor(teamRepository: IPokemonTeamRepository) {
        this.teamRepository = teamRepository;
    }

    async create(trainerId: number): Promise<PokemonTeam> {
        // create a new team in db
        const newPokemonTeam = await this.teamRepository.create(trainerId);
        return newPokemonTeam;
    }
}


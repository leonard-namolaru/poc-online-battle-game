import { Pokemon, User} from "./entities";
import { IUserRepository } from "./interfaces";

export class CreateUserUsecase {
    private userRepository: IUserRepository;

    constructor(trainerRepository: IUserRepository) {
        this.userRepository = trainerRepository;
    }

    async execute(command: {name: string, pwd: string, email: string,
        inscriptionDate: Date, myTrainer: number , AllMyPokemon: Pokemon[]}): Promise<User> {
        // create a new trainer in db
        const newUser = await this.userRepository.create({
            name: command.name,
            pwd: command.pwd,
            email: command.email,
            inscriptionDate: command.inscriptionDate,
            myTrainer: command.myTrainer,
            AllMyPokemon: [],
        });
        return newUser;
    }
}


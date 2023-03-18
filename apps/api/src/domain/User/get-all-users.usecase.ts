import { User } from "../entities";
import { IUserRepository } from "../interfaces";

export class GetAllUsersUsecase {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async execute(): Promise<User[]> {
        // return all users in db
        const trainers = await this.userRepository.findAll();
        console.log("toto")
        return trainers;
    }
}

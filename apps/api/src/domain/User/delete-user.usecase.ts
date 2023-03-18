import { IUserRepository } from "../interfaces";

export class DeleteUserUsecase {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async execute(command: {userId: number}): Promise<boolean> {
        return this.userRepository.delete(command.userId);
    }
}
import { User } from "./entities";
import { IUserRepository } from "./interfaces";

export class UserUsecase {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async getLogin( email: string, pwd: string ): Promise<User> {
        return this.userRepository.findMyUserwithLogin(email,pwd);
    }

    async getToken(uniqueToken:string): Promise<User>{
        return this.userRepository.findUserToken(uniqueToken)
    }
    async updateToken(user :User): Promise<User>{
        return this.userRepository.update(user)
    }
   
}


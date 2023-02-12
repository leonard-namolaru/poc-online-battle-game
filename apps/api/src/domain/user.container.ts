import {UserRepository} from "./../infrastructure/user.repository";
import {CreateUserUsecase } from "./create-user.usecase";
import {GetAllUsersUsecase} from "./get-all-users.usecase";
import {UserUsecase} from "./user.usecase";

export type UserContainer = {
    createUserUsecase: CreateUserUsecase;
    getAllUsersUsecase: GetAllUsersUsecase;
    userUsecase: UserUsecase;
    
}

export const initUserContainer = (): UserContainer => {
    const userRepository = new UserRepository();
    const createUserUsecase = new CreateUserUsecase(userRepository);
    const getAllUsersUsecase = new GetAllUsersUsecase(userRepository);
    const userUsecase = new UserUsecase(userRepository)

    return {
        createUserUsecase,
        getAllUsersUsecase,
        userUsecase,
    }
}
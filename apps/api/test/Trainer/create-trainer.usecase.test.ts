 import {afterEach, describe, expect, test, vi} from 'vitest'
import {CreateTrainerUsecase} from "../../src/domain/Trainer/create-trainer.usecase";
import {Trainer} from '../../src/domain/entities';
 import {initUserContainer} from "../../src/domain/User/user.container";

describe('Create Trainer Usecase - test', () => {
    const trainerRepositoryMock = {
        create: vi.fn(),
        findAll: vi.fn(),
        find : vi.fn(),
        update : vi.fn(),
        delete : vi.fn(),
    }

    const createTrainerUsecase = new CreateTrainerUsecase(trainerRepositoryMock)

    afterEach(() => {
        vi.restoreAllMocks()
    })

    test('should create ', async () => {
        // GIVEN
        const userContainer = initUserContainer()
        const newUserForCreateTrainerUseCaseTest = await userContainer.createUserUsecase.execute({
            email : "test4_" + (new Date()).getMilliseconds() + "@test.test",
            pwd   : "newUserForCreateTrainerUseCaseTest",
            name: "",
            inscriptionDate: new Date,
            AllMyPokemon: [],
        });

        const expectedTrainer = {
            id: 1,
            name: 'Toto',
            gender: 'f',
            userId : newUserForCreateTrainerUseCaseTest.id
        }
        trainerRepositoryMock.create.mockImplementation(() => expectedTrainer)

        // WHEN

        const trainer = await createTrainerUsecase.execute({
            name: expectedTrainer.name,
            gender: expectedTrainer.gender,
            userId : newUserForCreateTrainerUseCaseTest.id
        })

        // THEN
        expect(trainerRepositoryMock.create).toHaveBeenCalledOnce()
        expect(trainerRepositoryMock.create).toBeCalledWith({
            name: expectedTrainer.name,
            gender: expectedTrainer.gender,
            userId: expectedTrainer.userId
        })
        expect(expectedTrainer).toStrictEqual(trainer);
    })
})
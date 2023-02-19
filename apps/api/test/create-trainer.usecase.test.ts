import {afterEach, describe, expect, test, vi} from 'vitest'
import {CreateTrainerUsecase} from "../src/domain/create-trainer.usecase";
import {Trainer} from '../src/domain/entities';

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
        const expectedTrainer: Trainer = {
            id: 1,
            name: 'Toto',
            gender: 'f',
        }
        trainerRepositoryMock.create.mockImplementation(() => expectedTrainer)

        // WHEN
        const trainer = await createTrainerUsecase.execute({
            name: expectedTrainer.name,
            gender: expectedTrainer.gender,
            activeTeam: expectedTrainer.activeTeam
        })

        // THEN
        expect(trainerRepositoryMock.create).toHaveBeenCalledOnce()
        expect(trainerRepositoryMock.create).toBeCalledWith({
            name: expectedTrainer.name,
            gender: expectedTrainer.gender
        })
        expect(expectedTrainer).toStrictEqual(trainer);
    })
})
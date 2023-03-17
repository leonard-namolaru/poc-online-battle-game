import {describe, expect, expectTypeOf, test} from 'vitest'
import {TrainerRepository} from "../src/infrastructure/trainer.repository";
import {initUserContainer} from "../src/domain/user.container";
describe('Train Repository - test', () => {
    const trainerRepository = new TrainerRepository()
    const userContainer = initUserContainer()

    test('#create', async () => {
        // GIVEN
        const name = 'Toto';
        const gender = 'f';

        const newUser = await userContainer.createUserUsecase.execute({
            email : "test6_" + (new Date()).getMilliseconds() + "@test.test",
            pwd : "test",
            name: "",
            inscriptionDate: new Date,
            AllMyPokemon: [],
        });

        // WHEN
        const trainer = await trainerRepository.create({name : name, gender : gender, userId : newUser.id})

        // THEN
        expectTypeOf(trainer.id).toBeNumber();
        expect(trainer.name).toEqual(name);
        expect(trainer.gender).toEqual(gender);
    })
})
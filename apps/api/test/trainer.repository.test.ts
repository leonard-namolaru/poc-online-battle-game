import {describe, expect, expectTypeOf, test} from 'vitest'
import {TrainerRepository} from "../src/infrastructure/trainer.repository";

describe('Train Repository - test', () => {
    const trainerRepository = new TrainerRepository()

    test('#create', async () => {
        // GIVEN
        const name = 'Toto';
        const gender = 'f';

        // WHEN
        const trainer = await trainerRepository.create({name, gender})

        // THEN
        expectTypeOf(trainer.id).toBeNumber();
        expect(trainer.name).toEqual(name);
        expect(trainer.gender).toEqual(gender);
    })
})
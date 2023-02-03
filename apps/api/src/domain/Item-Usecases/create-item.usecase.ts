import { Item} from "../entities";
import { IItemRepository } from "../interfaces";

export class CreateItemUsecase {
    private itemRepository: IItemRepository;

    constructor(itemRepository: IItemRepository) {
        this.itemRepository = itemRepository;
    }

    async execute(command: { name: string, effect: number }): Promise<Item> {
        // create a new item in db
        const newItem = await this.itemRepository.create({
            name: command.name,
            effect: command.effect,
        });
        return newItem;
    }
}


import { Item} from "./../entities";
import { IItemRepository } from "./../interfaces";

export class UpdateItemUsecase {
    private itemRepository: IItemRepository;

    constructor(ItemRepository: IItemRepository) {
        this.itemRepository = ItemRepository;
    }

    async execute(command: { id:number ,name: string, effect: number }): Promise<Item> {
        // update an Item in db
        const newItem = await this.itemRepository.update({
            id: command.id,
            name: command.name,
            effect: command.effect,
        });
        return newItem;
    }
}
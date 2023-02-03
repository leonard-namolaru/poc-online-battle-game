import { Item } from "./../entities";
import { IItemRepository } from "./../interfaces";

export class GetAllItemsUsecase {
    private itemRepository: IItemRepository;

    constructor(ItemRepository: IItemRepository) {
        this.itemRepository = ItemRepository;
    }

    async execute(): Promise<Item[]> {
        // return all Items in db
        const items = await this.itemRepository.findAll();
        return items;
    }
}

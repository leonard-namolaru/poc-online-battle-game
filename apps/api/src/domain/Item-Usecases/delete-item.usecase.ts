import { Item } from "./../entities";
import { IItemRepository } from "./../interfaces";

export class DeleteItemUsecase {
  private itemRepository: IItemRepository;

  constructor(itemRepository: IItemRepository) {
    this.itemRepository = itemRepository;
  }

  async execute(command: { id: number }): Promise<Item> {
    // delete a  Item in db
    const DeletedItem = await this.itemRepository.delete(command.id);
    return DeletedItem;
  }
}

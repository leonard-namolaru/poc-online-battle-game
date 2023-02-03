import {IItemRepository} from "../domain/interfaces";
import {Item} from "../domain/entities";
import {prisma} from "../../db";


export class ItemRepository implements IItemRepository {
    async create(item :{ name: string, effect: number }): Promise<Item> {
        const newItem = await prisma.item.create({
            data: {
                name: item.name,
                effect: item.effect,
            },
        });

        return newItem;
    }

    async findAll(): Promise<Item[]> {
        const items: Item[] = await prisma.item.findMany();

        return items;
    }

    async find(itemId : number) : Promise<Item> {
        const item = await prisma.item.findUnique({
            where: {
                id: itemId
            }
        })
        if (item === null){
            return Promise.reject("Trainer not in DB.")
        }
        return item
    }

    async update(item: Item): Promise<Item>{
        const ret = await prisma.item.update({
            where:{
                id: item.id
            },
            data: {
                name: item.name,
                effect: item.effect,
            }
        });
        return ret;
    }
    async delete(itemId : number): Promise<Item>{
        const ret = await prisma.item.delete({
            where:{
                id: itemId
            },
        });
        return ret;
    }
}

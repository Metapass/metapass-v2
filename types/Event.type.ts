import { User } from "./User.type"

export type Event = {
    title: string,
    owner: string,
    description: string,
    price: number,
    image: string,
    category: string,
    type: string,
    tickets_available: number,
    tickets_sold: number,
    date: {
        month: number,
        date: number,
        year: number
    }
    buyers: Array<string>,
    slides: Array<string>,
    video?: string,
    hosts: Array<string>,
    long_description?: string
}
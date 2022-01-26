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
    link: string,
    date: {
        month: number,
        date: number,
        year: number
    }
}
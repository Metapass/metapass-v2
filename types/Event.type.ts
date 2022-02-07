export type Event = {
    id: string
    title: string
    childAddress: string
    category: string
    image: string
    eventHost: string
    fee: string
    date: string
    description: string
    seats: number
    owner: string
    price: number
    type: string
    buyers: Array<string>
    slides: Array<string>
    tickets_available: number
    tickets_sold: number
} //featuring event

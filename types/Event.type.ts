export type Event = {
    id: string
    title: string
    childAddress: string
    category: CategoryType
    image: ImageType
    eventHost: string
    fee: string
    date: string
    description: DescriptionType
    seats: number
    owner: string
    price: number
    type: string
    buyers: Array<string>
    slides: Array<string>
    tickets_available: number
    tickets_sold: number
} //featuring event
export type ImageType = {
    hero_image: string
    gallery: [string]
    video: string
}
export type DescriptionType = {
    short_desc: string
    long_desc: string
}
export type CategoryType = {
    event_type: string
    category: [string]
}

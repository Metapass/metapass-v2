export type Event = {
    id: string
    title: string
    childAddress: string
    category: CategoryType
    image: ImageType
    eventHost: string
    fee: Number
    date: string
    description: DescriptionType
    seats: number
    owner: string
    type: string
    buyers: Array<string>
    tickets_available: number
    tickets_sold: number
    link?: string
    isHuddle: boolean
}

export type ImageType = {
    image: string
    gallery: Array<string>
    video?: string
}
export type DescriptionType = {
    short_desc: string
    long_desc?: string
}
export type CategoryType = {
    event_type: EventCategoryType
    category: Categories[]
    inviteOnly: boolean
}

export type EventCategoryType = 'In-Person' | 'Online' | 'Type' | ''
export type Categories = 'Meetup' | 'Party' | 'Category' | 'Invite Only' | ''

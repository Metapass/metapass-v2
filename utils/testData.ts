import { Event } from "../types/Event.type";

const event = {
    title: "Web Summit Pitch 2022",
    owner: "0x436441A8eF5b3C705652a8b0dff624152c227a6f",
    description: "The Abcd Company’s official community meetup for 2022 is here!",
    image: "https://assets.entrepreneur.com/content/3x2/2000/20160321103826-shutterstock-217119211.jpeg",
    category: "Meetup",
    type: "In-person",
    price: 200,
    date: {
        date: 25,
        month: 7,
        year: 2022
    },
    link: "https://google.com",
    tickets_available: 40,
    tickets_sold: 13,
    featured: true
}


const event2 = {
    title: "Web Summit Pitch 2022",
    owner: "0x436441A8eF5b3C705652a8b0dff624152c227a6f",
    description: "The Abcd ",
    image: "https://content.fortune.com/wp-content/uploads/2020/03/digital-parties-zoom.png",
    category: "Meetup",
    type: "In-person",
    price: 200,
    date: {
        date: 25,
        month: 7,
        year: 2022
    },
    link: "https://google.com",
    tickets_available: 40,
    tickets_sold: 40,
    featured: false
}
export const events: Array<Event> = [
    event, event2, event, event2, event, event
]
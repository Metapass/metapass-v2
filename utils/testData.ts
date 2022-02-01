import { Event } from "../types/Event.type";
import { User } from "../types/User.type";

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
    tickets_available: 40,
    tickets_sold: 13,
    featured: true,
    buyers: ["0x436441A8eF5b3C705652a8b0dff624152c227a6f", "0x436441A8eF5b3C705652a8b0dff624152c227a62"],
    hosts: ["0x436441A8eF5b3C705652a8b0dff624152c227a6f", "0x436441A8eF5b3C705652a8b0dff624152c227a62"],
    video: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    slides: [
        "https://content.fortune.com/wp-content/uploads/2020/03/digital-parties-zoom.png",
        "https://assets.entrepreneur.com/content/3x2/2000/20160321103826-shutterstock-217119211.jpeg",
    ],
    long_description: "# Nice and cool event \n Let's see what we can do **lmao** https://linktest.com"
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
    video: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    tickets_available: 40,
    tickets_sold: 40,
    featured: false,
    buyers: ["0x436441A8eF5b3C705652a8b0dff624152c227a6f"],
    hosts: ["0x436441A8eF5b3C705652a8b0dff624152c227a6f", "0x436441A8eF5b3C705652a8b0dff624152c227a62"],
    slides: [
        "https://content.fortune.com/wp-content/uploads/2020/03/digital-parties-zoom.png",
        "https://assets.entrepreneur.com/content/3x2/2000/20160321103826-shutterstock-217119211.jpeg",
    ],


}
export const events: Array<Event> = [
    event, event2, event, event2, event, event
]

export const users: any = {
    "0x436441A8eF5b3C705652a8b0dff624152c227a6f": {
        address: "0x436441A8eF5b3C705652a8b0dff624152c227a6f",
        username: "Exwhyzee",
        avatar: "http://jingculturecommerce.com/wp-content/uploads/2021/11/rtfkt-murakami-clone-x-4-1024x682.jpg",
        banner: undefined,
        bio: "17 | Product Designer & Part-time Ninja"
    },
    "0x436441A8eF5b3C705652a8b0dff624152c227a62": {
        address: "0x436441A8eF5b3C705652a8b0dff624152c227a62",
        username: "Saptarshi",
        avatar: "https://static.prinseps.com/media/uploads/cryptopunk6278.png",
        banner: undefined,
        bio: "UI/UX & Frontend"
    }

}
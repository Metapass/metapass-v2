import {
  Event,
  DescriptionType,
  CategoryType,
  ImageType,
} from '../../types/Event.type';

function UnicodeDecodeB64(str: any) {
  return decodeURIComponent(Buffer.from(str, 'base64').toString());
}

const parseEvent = (event: any): Event => {
  let type: string = JSON.parse(UnicodeDecodeB64(event.category)).event_type;
  let category: CategoryType = JSON.parse(UnicodeDecodeB64(event.category));
  let image: ImageType = JSON.parse(UnicodeDecodeB64(event.image));
  let desc: DescriptionType = JSON.parse(UnicodeDecodeB64(event.description));
  return {
    id: event.id,
    title: event.title,
    childAddress: event.childAddress,
    category: category,
    image: image,
    eventHost: event.eventHost,
    fee: Number(event.fee) / 10 ** 18,
    date: event.date,
    description: desc,
    seats: event.seats,
    owner: event.eventHost,
    link: event.link,
    type: type,
    tickets_available: event.seats - event.ticketsBought?.length,
    tickets_sold: event.ticketsBought?.length,
    buyers: event.buyers,
    slides: image.gallery,
    isHuddle: event.link.includes('huddle01') ? true : false,
  } as Event;
};

export { parseEvent };

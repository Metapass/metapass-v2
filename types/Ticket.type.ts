import { Event } from './Event.type';
export type TicketType = {
  id: string;
  ticketID: string;
  buyer: { id: string };
  event: Event;
};

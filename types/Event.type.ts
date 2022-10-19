export type Event = {
  id: string;
  title: string;
  childAddress: string;
  category: CategoryType;
  image: ImageType;
  eventHost: string;
  fee: Number;
  date: string;
  description: DescriptionType;
  seats: number;
  owner: string;
  type: string;
  venue?: VenueType;
  buyers: Array<string>;
  tickets_available: number;
  tickets_sold: number;
  link?: string;
  isHuddle: boolean;
  isSolana: boolean;
  displayName?: string;
  profileImage?: string;
  customSPLToken?: string;
};
export type VenueType = {
  name: string;
  x: number;
  y: number;
};
export type ImageType = {
  image: string;
  gallery: Array<string>;
  video?: string;
};
export type DescriptionType = {
  short_desc: string;
  long_desc?: string;
};
export type CategoryType = {
  event_type: 'In-Person' | 'Online' | '';
  category: [string];
};

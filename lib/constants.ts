import { Event } from '../types/Event.type'
import { formType } from '../types/registerForm.types'

const defaultFormData: formType = {
    preDefinedQues: [
        { val: 'Name', isRequired: true, id: 1 },
        { val: 'Email Address', isRequired: true, id: 2 },
        { val: 'Wallet Address', isRequired: true, id: 3 },
    ],
    customQues: [],
}

const eventData: Event = {
    id: '',
    title: '',
    childAddress: '',
    category: {
        event_type: '',
        category: [''],
    },
    image: {
        image: '',
        gallery: [],
        video: '',
    },
    eventHost: '',
    fee: 0,
    date: '',
    description: {
        short_desc: '',
        long_desc: '',
    },
    seats: 0,
    owner: '',
    type: '',
    tickets_available: 0,
    tickets_sold: 0,
    buyers: [],
    link: '',
    isHuddle: false,
    isSolana: false,
    displayName: '',
    profileImage: '',
    customSPLToken: '',
}

const API_URL = 'https://metapass-discord-inte-production.up.railway.app'

export { defaultFormData, eventData, API_URL }

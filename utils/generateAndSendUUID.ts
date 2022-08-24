import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../lib/config/supabaseConfig'

export default async function generateAndSendUUID(
    event_address: string,
    user_address: string,
    ticketID: number,
    image: string,
    formData: any
) {
    const uuid = uuidv4()
    const { data, error } = await supabase.from('tickets').insert({
        ticketID: ticketID,
        uuid: uuid,
        buyer: user_address,
        event: event_address,
        checkedIn: false,
        ticketImage: image,
        formresponse: formData,
    })

    return uuid as string
}

import { v4 as uuidv4 } from 'uuid'
import { updateDoc, doc, db, arrayUnion } from '../utils/firebaseUtils'

export default async function generateAndSendUUID(
    event_address: string,
    user_address: string,
    ticketID: number
) {
    try {
        const uuid = uuidv4()
        await updateDoc(doc(db, 'events', event_address), {
            [user_address]: arrayUnion({
                uuid: uuid,
                user_address: user_address,
                timestamp: new Date().toISOString(),
                ticketID: ticketID,
            }),
        })
        return String(uuid)
    } catch (error) {
    }
}

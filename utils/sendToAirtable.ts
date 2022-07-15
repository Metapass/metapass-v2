import Airtable from 'airtable'
var base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE }).base(
    'appQdbxTOdZxnkyBM'
)

async function sendToAirtable(
    email: string,
    setIsSubmitting: any,
    onClose: any
) {
    setIsSubmitting(true)
    const data = {
        fields: {
            Email: email,
        },
    }

    base('Waitlist').create([data], function (err: any, records: any[]) {
        if (err) {
            console.error(err)
            return
        }
        records.forEach(function (record) {
            setIsSubmitting(false)
            onClose()
        })
    } as any)
}


export async function getAllowedList() {

    const data = await base('eventorgs').select().all()
    return data
}
export default sendToAirtable
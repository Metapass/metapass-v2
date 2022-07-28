import axios from 'axios'
import { useEffect, useState } from 'react'

const resolveBalance = async (address: string) => {
    console.log('resolveBalance', address)
    // setLoading(true)
    try {
        if (address) {
            const { data } = await axios(
                `https://api.shyft.to/sol/v1/wallet/balance?network=mainnet-beta&wallet=${address}`,
                {
                    method: 'GET',
                    headers: {
                        'x-api-key': process.env
                            .NEXT_PUBLIC_SHYFT_KEY as string,
                    },
                }
            )
            // console.log('resolveBalance', data)
            if (data.success === true) {
                const userBalance = data.result.balance as number
                // console.log('resolveBalance2', userBalance)
                return userBalance
                // console.log('balance', balance)
            } else {
                return null
            }
        }
    } catch (error) {
        console.log(error)
    }

    // setLoading(false)
}

export default resolveBalance

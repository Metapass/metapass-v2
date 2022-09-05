import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import axios from 'axios'
import { useEffect, useState } from 'react'

const resolveBalance = async (address: string) => {
    // console.log('resolveBalance', address)
    // setLoading(true)
    try {
        if (address) {
            const { data } = await axios(
                `https://api.helius.xyz/v0/addresses/${address}/balances?api-key=74edbdf5-7aa8-4cf1-9ea2-c82cece42421`,
                {
                    method: 'GET',
                }
            )

            // console.log('resolveBalance', data)
            if (data.nativeBalance) {
                const userBalance = (data.nativeBalance /
                    LAMPORTS_PER_SOL) as number

                // console.log(data.nativeBalance, 'bal')

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

import axios from 'axios'
import { Event } from '../../types/Event.type'
import { WalletType } from '../walletContext'
import { supabase } from '../../lib/config/supabaseConfig'
import { ethers } from 'ethers'
import MetapassABI from '../../utils/Metapass.json'
import toast from 'react-hot-toast'

const polygonEventHandler = async (
    event: Event,
    contract: any,
    wallet: WalletType,
    inviteOnly: boolean
) => {
    let res
    function b64EncodeUnicode(str: any) {
        return btoa(encodeURIComponent(str))
    }
    if (!event.isHuddle) {
        try {
            let txn = await contract?.createEvent(
                String(event.title),
                ethers.utils.parseEther(event.fee.toString()),
                Number(event.seats),
                b64EncodeUnicode(JSON.stringify(event.image)),
                wallet.address,
                b64EncodeUnicode(JSON.stringify(event.description)),
                event.link,
                event.date,
                b64EncodeUnicode(JSON.stringify(event.category)),
                'undefined'
            )
            txn.wait().then(async (res: any) => {
                let child = res.events.filter(
                    (e: any) => e.event === 'childEvent'
                )[0].args[0]
                if (event.fee == 0) {
                    await axios({
                        method: 'post',
                        url: 'https://api.biconomy.io/api/v1/smart-contract/public-api/addContract',
                        data: {
                            contractName: event.title,
                            contractAddress: child,
                            contractType: 'SC',
                            abi: JSON.stringify(MetapassABI.abi),
                            walletType: '',
                            metaTransactionType: 'TRUSTED_FORWARDER',
                        },
                        headers: {
                            authToken: process.env
                                .NEXT_PUBLIC_BICONOMY_DASH_API as string,
                            apiKey: process.env
                                .NEXT_PUBLIC_BICONOMY_API as string,
                        },
                    })
                    await axios({
                        method: 'post',
                        url: 'https://api.biconomy.io/api/v1/meta-api/public-api/addMethod',
                        data: {
                            name: event.title,
                            apiType: 'native',
                            methodType: 'write',
                            contractAddress: child,
                            method: 'getTix',
                        },
                        headers: {
                            authToken: process.env
                                .NEXT_PUBLIC_BICONOMY_DASH_API as string,
                            apiKey: process.env
                                .NEXT_PUBLIC_BICONOMY_API as string,
                        },
                    })
                }
                const { data, error } = await supabase.from('events').insert({
                    contractAddress: child,
                    inviteOnly: inviteOnly,
                })
                res = child
            })
        } catch (err: any) {}
    } else {
        try {
            let txn = await contract?.createEvent(
                String(event.title),
                ethers.utils.parseEther(event.fee.toString()),
                Number(event.seats),
                b64EncodeUnicode(JSON.stringify(event.image)),
                wallet.address,
                b64EncodeUnicode(JSON.stringify(event.description)),
                '',
                event.date,
                b64EncodeUnicode(JSON.stringify(event.category)),
                'undefined'
            )
            txn.wait().then(async (res: any) => {
                let child = res.events.filter(
                    (e: any) => e.event === 'childEvent'
                )[0].args[0]
                if (event.fee == 0) {
                    let c = await axios({
                        method: 'post',
                        url: 'https://api.biconomy.io/api/v1/smart-contract/public-api/addContract',
                        data: {
                            contractName: event.title,
                            contractAddress: child,
                            contractType: 'SC',
                            abi: JSON.stringify(MetapassABI.abi),
                            walletType: '',
                            metaTransactionType: 'TRUSTED_FORWARDER',
                        },
                        headers: {
                            authToken: process.env
                                .NEXT_PUBLIC_BICONOMY_DASH_API as string,
                            apiKey: process.env
                                .NEXT_PUBLIC_BICONOMY_API as string,
                        },
                    })
                    let a = await axios({
                        method: 'post',
                        url: 'https://api.biconomy.io/api/v1/meta-api/public-api/addMethod',
                        data: {
                            name: event.title,
                            apiType: 'native',
                            methodType: 'write',
                            contractAddress: child,
                            method: 'getTix',
                        },
                        headers: {
                            authToken: process.env
                                .NEXT_PUBLIC_BICONOMY_DASH_API as string,
                            apiKey: process.env
                                .NEXT_PUBLIC_BICONOMY_API as string,
                        },
                    })
                    let roomLink = await axios.post(
                        process.env.NEXT_PUBLIC_HUDDLE_API as string,
                        {
                            title: event.title,
                            host: event.owner,
                            contractAddress: child,
                        }
                    )
                    try {
                        await contract.updateLink(
                            child,
                            roomLink.data.meetingLink
                        )
                    } catch (e) {}
                } else {
                    let roomLink = await axios.post(
                        process.env.NEXT_PUBLIC_HUDDLE_API as string,
                        {
                            title: event.title,
                            host: event.owner,
                            contractAddress: child,
                        }
                    )
                    try {
                        await contract.updateLink(
                            child,
                            roomLink.data.meetingLink
                        )
                    } catch (e) {}
                }
                const { data, error } = await supabase.from('events').insert({
                    contractAddress: child,
                    inviteOnly: inviteOnly,
                })
                res = child
            })
        } catch (err: any) {
            toast.error('Oops! Error in main fn')
            res = undefined
            console.log(err);
        }
    }

    return res
}

export { polygonEventHandler }

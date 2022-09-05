import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    FormControl,
    FormLabel,
    Flex,
    Badge,
    Box,
    Text,
} from '@chakra-ui/react'
import { utils } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/config/supabaseConfig'
import { ModalProps } from '../../types/ModalProps.types'
import type { formDataType, formType } from '../../types/registerForm.types'
import { useForm } from 'react-hook-form'
import { camelize } from '../../utils/helpers/camelize'
import toast from 'react-hot-toast'
import { sendRegisteredMail } from '../../utils/helpers/sendRegisteredMail'
import { Event } from '../../types/Event.type'
import { useRecoilState } from 'recoil'
import { updateOnce } from '../../lib/recoil/atoms'
import { defaultFormData } from '../../lib/constants'
import { walletContext } from '../../utils/walletContext'
import axios from 'axios'
import { QuestionComp } from '../Misc/question.component'
import { RegistrationTemplate } from '../../utils/registrationtemplate'
interface formNew {
    id: number
    data: formType
    datadrop: any[]
}
export const RegisterFormModal = ({
    isOpen,
    onClose,
    onOpen,
    event,
    express,
}: ModalProps) => {
    const [formData, setData] = useState<formNew>({
        id: 0,
        data: defaultFormData,
        datadrop: [],
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [toUpdate, setToUpdate] = useRecoilState(updateOnce)

    const user = supabase.auth.user()
    const [wallet, setWallet]: any = useContext(walletContext)

    useEffect(() => {
        const fetchData = async () => {
            if (event) {
                let a = event.childAddress as string
                if (event.childAddress.startsWith('0x')) {
                    a = utils.getAddress(event.childAddress as string)
                }
                const { data, error } = await supabase
                    .from('forms')
                    .select('id, event, data,datadrop')
                    .eq('event', a)
                data?.length !== 0 &&
                    setData({
                        id: data?.[0]?.id,
                        data: {
                            preDefinedQues: data?.[0].data?.preDefinedQues,
                            customQues: data?.[0].data?.customQues!,
                        },
                        datadrop: data?.[0]?.datadrop?.ques,
                    })
                console.log(data)
            }
        }

        fetchData()
    }, [event])

    // console.log(formData?.data, 'form data')

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm()

    const onSubmit = async (res: any) => {
        // setIsLoading(true)
        let a = event?.childAddress as string
        if (event?.childAddress.startsWith('0x')) {
            a = utils.getAddress(event.childAddress as string)
        }
        const { data, error } = await supabase.from('responses').insert({
            event: a,
            form: formData?.id,
            response: res,
            email: user?.email,
            address: wallet.address,
            accepted: express ? true : null,
        })
        const { data: emails, error: e } = await supabase
            .from('emails')
            .select('*')
            .eq('event', a)
            .eq('type', 'Registration')
            .eq('On', true)
        if (error) {
            toast.error('Error Uploading Details')
        } else {
            toast.success('Details Uploaded')
            if (!express) {
                if (emails && emails.length > 0) {
                    const date = event?.date as string
                    const body = RegistrationTemplate(
                        event?.title as string,
                        new Date(Date.parse(date.split('T')[0])).toDateString(),
                        `https://www.google.com/maps/search/?api=1&query=${
                            event?.venue?.name as string
                        }`,
                        `https://app.metapasshq.xyz/event/${
                            event?.childAddress as string
                        }`,
                        emails[0].body
                    )
                    await axios.post('/api/sendRegisteredEmail', {
                        email: user?.email,
                        message: body,
                        subject: emails[0].subject,
                    })
                } else {
                    console.log('no registration email')
                }
            } else {
                if (!a.startsWith('0x')) {
                    let { data: user1 } = await supabase
                        .from('users')
                        .select('*')
                        .eq('address', res.walletAddress)
                    console.log(user1)
                    if (user1?.length == 0) {
                        await supabase.from('users').insert({
                            email: res.emailAddress,
                            address: res.walletAddress,
                            Name: res.name,
                            type: 'attendee',
                        })
                    }
                    await axios.post('/api/expressSolanaMint', {
                        mintTasks: [
                            {
                                wallet: res.walletAddress,
                                event: event,
                                childAddress: event?.childAddress,
                            },
                        ],
                    })
                    const { data: count } = await supabase
                        .from('express')
                        .select('count')
                        .eq('contractAddress', event?.childAddress)
                    await supabase
                        .from('express')
                        .update({
                            count: count?.[0].count + 1,
                        })
                        .match({ contractAddress: event?.childAddress })
                    toast.success(
                        'You got in! Check your email in a minute for your more info!'
                    )
                } else {
                    toast('No yet available for polygon events')
                }
            }
            setToUpdate(!toUpdate)
        }
        setIsLoading(false)
        reset()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Register Form</ModalHeader>
                <ModalCloseButton _focus={{}} _active={{}} />
                <ModalBody py="6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            w="full"
                            direction="column"
                            gap="3"
                        >
                            {formData?.data?.preDefinedQues?.map((ques) => (
                                <FormControl key={ques.id}>
                                    <Box
                                        display={'flex'}
                                        justifyContent={'start'}
                                        alignItems={'start'}
                                    >
                                        <FormLabel>{ques.val} </FormLabel>
                                        {ques.isRequired && (
                                            <Text ml={-2} color="red">
                                                *
                                            </Text>
                                        )}
                                    </Box>
                                    <Flex gap="2" alignItems="center">
                                        <Input
                                            placeholder={ques.val}
                                            w="md"
                                            isRequired={ques.isRequired}
                                            isReadOnly={
                                                wallet.address &&
                                                (ques.id === 3 || ques.id == 2)
                                            }
                                            defaultValue={
                                                ques.id == 2
                                                    ? user?.email
                                                    : ques.id == 3
                                                    ? wallet?.address
                                                    : ''
                                            }
                                            {...register(camelize(ques.val))}
                                        />
                                    </Flex>
                                </FormControl>
                            ))}
                            {formData?.data?.customQues?.map((ques) => (
                                <FormControl key={ques.id}>
                                    <Box
                                        display={'flex'}
                                        justifyContent={'start'}
                                    >
                                        <FormLabel>{ques.val}</FormLabel>
                                        {ques.isRequired && (
                                            <Text ml={-2} color="red">
                                                *
                                            </Text>
                                        )}
                                    </Box>
                                    <Flex gap="2" alignItems="center">
                                        <Input
                                            placeholder={ques.val}
                                            w="md"
                                            isRequired={false}
                                            {...register(camelize(ques.val))}
                                        />
                                    </Flex>
                                </FormControl>
                            ))}
                            {formData.datadrop?.map((q, index) => {
                                return (
                                    <>
                                        <Flex></Flex>
                                        <QuestionComp
                                            key={index}
                                            question={q}
                                            register={register}
                                        />
                                    </>
                                )
                            })}
                            <Button
                                bg={'brand.gradient'}
                                fontWeight="500"
                                _focus={{}}
                                _hover={{ bg: 'brand.gradient' }}
                                _active={{}}
                                w="28"
                                type="submit"
                                isLoading={isLoading}
                                textColor="white"
                            >
                                Submit
                            </Button>
                        </Flex>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

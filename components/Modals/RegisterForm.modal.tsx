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
import type { formDataType } from '../../types/registerForm.types'
import { useForm } from 'react-hook-form'
import { camelize } from '../../utils/helpers/camelize'
import toast from 'react-hot-toast'
import { sendRegisteredMail } from '../../utils/helpers/sendRegisteredMail'
import { Event } from '../../types/Event.type'
import { useRecoilState } from 'recoil'
import { updateOnce } from '../../lib/recoil/atoms'
import { defaultFormData } from '../../lib/constants'
import { walletContext } from '../../utils/walletContext'

export const RegisterFormModal = ({
    isOpen,
    onClose,
    onOpen,
    event,
}: ModalProps) => {
    const [formData, setData] = useState<formDataType>({
        id: 0,
        data: defaultFormData,
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [toUpdate, setToUpdate] = useRecoilState(updateOnce)

    const user = supabase.auth.user()
    const [wallet, setWallet] = useContext(walletContext)

    useEffect(() => {
        const fetchData = async () => {
            if (event) {
                let a = event.childAddress as string
                if (event.childAddress.startsWith('0x')) {
                    a = utils.getAddress(event.childAddress as string)
                }
                const { data, error } = await supabase
                    .from('forms')
                    .select('id,event, data')
                    .eq('event', a)
                console.log(data)
                data?.length !== 0 &&
                    setData({
                        id: data?.[0]?.id,
                        data: {
                            preDefinedQues: data?.[0].data?.preDefinedQues,
                            customQues: data?.[0].data?.customQues!,
                        },
                    })
            }
        }

        fetchData()
    }, [event])
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm()

    const onSubmit = async (res: any) => {
        if (user) {
            setIsLoading(true)
            let a = event?.childAddress as string
            if (event?.childAddress.startsWith('0x')) {
                a = utils.getAddress(event.childAddress as string)
            }
            const { data, error } = await supabase.from('responses').insert({
                event: a,
                form: formData?.id,
                response: res,
                email: user?.email,
                accepted: false,
            })

            if (error) {
                toast.error('Error Uploading Details')
            } else {
                toast.success('Details Uploaded')
                sendRegisteredMail(
                    user?.email as string,
                    event?.title as string
                )
                setToUpdate(!toUpdate)
            }

            setIsLoading(false)
            reset()
            onClose()
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
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
                            {formData?.data?.preDefinedQues.map((ques) => (
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
                                            {...register(camelize(ques.val))}
                                            defaultValue={
                                                ques.id === 2
                                                    ? user?.email
                                                    : '' || ques.id === 3
                                                    ? wallet?.address
                                                    : ''
                                            }
                                            isReadOnly={ques.id === 2}
                                        />
                                    </Flex>
                                </FormControl>
                            ))}

                            {formData?.data?.customQues.map((ques) => (
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
                                            isRequired={ques.isRequired}
                                            {...register(camelize(ques.val))}
                                            defaultValue={
                                                ques.id === 2 ? user?.email : ''
                                            }
                                        />
                                    </Flex>
                                </FormControl>
                            ))}

                            <Button
                                bg={'brand.gradient'}
                                fontWeight="500"
                                _focus={{}}
                                _hover={{ bg: 'brand.gradient' }}
                                _active={{}}
                                w="28"
                                type="submit"
                                isLoading={isLoading}
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

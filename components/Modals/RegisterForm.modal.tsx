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
} from '@chakra-ui/react'
import { utils } from 'ethers'
import { useEffect, useState } from 'react'
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

    useEffect(() => {
        const fetchData = async () => {
            if (event) {
                const { data, error } = await supabase
                    .from('forms')
                    .select('id, data')
                    .eq('event', utils.getAddress(event.childAddress as string))

                    
                data?.length !== 0 && setData({
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

            const { data, error } = await supabase.from('responses').insert({
                event: utils.getAddress(event?.childAddress as string),
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
                                    <FormLabel>{ques.val} </FormLabel>
                                    <Flex gap="2" alignItems="center">
                                        <Input
                                            placeholder={ques.val}
                                            w="md"
                                            isRequired={ques.isRequired}
                                            {...register(camelize(ques.val))}
                                            defaultValue={
                                                ques.id === 2 ? user?.email : ''
                                            }
                                            isReadOnly={ques.id === 2}
                                        />
                                        {ques.isRequired && (
                                            <Badge
                                                display="grid"
                                                placeItems="center"
                                                px="3"
                                                rounded="full"
                                                colorScheme="purple"
                                                h="6"
                                            >
                                                Required
                                            </Badge>
                                        )}
                                    </Flex>
                                </FormControl>
                            ))}

                            {formData?.data?.customQues.map((ques) => (
                                <FormControl key={ques.id}>
                                    <FormLabel>{ques.val}</FormLabel>
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
                                        {ques.isRequired && (
                                            <Badge
                                                display="grid"
                                                placeItems="center"
                                                px="3"
                                                rounded="full"
                                                colorScheme="purple"
                                                h="6"
                                            >
                                                Required
                                            </Badge>
                                        )}
                                    </Flex>
                                </FormControl>
                            ))}

                            <Button
                                colorScheme="purple"
                                fontWeight="400"
                                _focus={{}}
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

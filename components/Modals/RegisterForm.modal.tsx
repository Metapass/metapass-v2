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
} from '@chakra-ui/react'
import { utils } from 'ethers'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/config/supabaseConfig'
import { ModalProps } from '../../types/ModalProps.types'
import type { formDataType } from '../../types/registerForm.types'
import { useForm } from 'react-hook-form'
import { camelize } from '../../utils/helpers/camelize'
import toast from 'react-hot-toast'

export const RegisterFormModal = ({
    isOpen,
    onClose,
    onOpen,
    event,
}: ModalProps) => {
    const [formData, setData] = useState<formDataType>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const user = supabase.auth.user()

    useEffect(() => {
        const fetchData = async () => {
            if (event) {
                const { data, error } = await supabase
                    .from('forms')
                    .select('id, data')
                    .eq('event', utils.getAddress(event as string))

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
        setIsLoading(true)

        const { data, error } = await supabase.from('responses').insert({
            event: utils.getAddress(event as string),
            form: formData?.id,
            response: res,
            email: user?.email,
        })

        error
            ? toast.error('Error Uploading Details')
            : toast.success('Details Uploaded')

        setIsLoading(false)
        reset()
        onClose()
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
                                    <FormLabel>{ques.val}</FormLabel>
                                    <Input
                                        placeholder={ques.val}
                                        w="md"
                                        isRequired={ques.isRequired}
                                        {...register(camelize(ques.val))}
                                        defaultValue={
                                            ques.id === 2 ? user?.email : ''
                                        }
                                    />
                                </FormControl>
                            ))}

                            {formData?.data?.customQues.map((ques) => (
                                <FormControl key={ques.id}>
                                    <FormLabel>{ques.val}</FormLabel>
                                    <Input
                                        placeholder={ques.val}
                                        w="md"
                                        isRequired={ques.isRequired}
                                        {...register(camelize(ques.val))}
                                    />
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

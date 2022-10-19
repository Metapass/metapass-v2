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
} from '@chakra-ui/react';
import { utils } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/config/supabaseConfig';
import { ModalProps } from '../../types/ModalProps.types';
import type { formDataType, formType } from '../../types/registerForm.types';
import { useForm } from 'react-hook-form';
import { camelize } from '../../utils/helpers/camelize';
import toast from 'react-hot-toast';
import { sendRegisteredMail } from '../../utils/helpers/sendRegisteredMail';
import { Event } from '../../types/Event.type';
import { useRecoilState } from 'recoil';
import { updateOnce } from '../../lib/recoil/atoms';
import { defaultFormData } from '../../lib/constants';
import { walletContext } from '../../utils/walletContext';
import axios from 'axios';
import { QuestionComp } from '../Misc/question.component';
import { RegistrationTemplate } from '../../utils/registrationtemplate';
import { useUser } from '../../hooks/useUser';
import { send } from '@metapasshq/msngr';
import moment from 'moment';
interface formNew {
  id: number;
  data: formType;
  datadrop: any[];
}
export const RegisterFormModal = ({
  isOpen,
  onClose,
  onOpen,
  event,
}: ModalProps) => {
  const [formData, setData] = useState<formNew>({
    id: 0,
    data: defaultFormData,
    datadrop: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toUpdate, setToUpdate] = useRecoilState(updateOnce);

  const { user } = useUser();
  const [wallet, setWallet] = useContext(walletContext);

  useEffect(() => {
    const fetchData = async () => {
      if (event) {
        let a = event.childAddress as string;
        if (event.childAddress.startsWith('0x')) {
          a = utils.getAddress(event.childAddress as string);
        }
        const { data, error } = await supabase
          .from('forms')
          .select('id, event, data,datadrop')
          .eq('event', a);
        data?.length !== 0 &&
          setData({
            id: data?.[0]?.id,
            data: {
              preDefinedQues: data?.[0].data?.preDefinedQues,
              customQues: data?.[0].data?.customQues!,
            },
            datadrop: data?.[0]?.datadrop?.ques,
          });
        console.log(data);
      }
    };

    fetchData();
  }, [event, wallet.address]);

  // console.log(formData?.data, 'form data')

  const {
    register,
    handleSubmit,
    watch,
    resetField,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (res: any) => {
    console.log(res, 'first response');

    if (user) {
      console.log('inside');
      await send(process.env.NEXT_PUBLIC_SWITCH_HOOK!, {
        message:
          'New Registration | main wallet: ' +
          wallet.address +
          ' | form wallet: ' +
          res.walletAddress +
          ` | wallet type` +
          wallet.type,
      });
      res.walletAddress = wallet.address;
      console.log(res, 'second response');

      setIsLoading(true);
      let a = event?.childAddress as string;
      if (event?.childAddress.startsWith('0x')) {
        a = utils.getAddress(event.childAddress as string);
      }
      const { data, error } = await supabase.from('responses').insert({
        event: a,
        form: formData?.id,
        response: res,
        email: user?.email,
        address: wallet.address,
        accepted: null,
      });
      const { data: emails, error: e } = await supabase
        .from('emails')
        .select('*')
        .eq('event', a)
        .eq('type', 'Registration')
        .eq('On', true);
      if (error) {
        toast.error('Error Uploading Details');
      } else {
        toast.success('Details Uploaded');
        if (emails && emails.length > 0) {
          const date = event?.date as string;
          const body = RegistrationTemplate(
            event?.title as string,
            moment(date.split('T')[0]).format('ddd MMM DD YYYY'),
            `https://www.google.com/maps/search/?api=1&query=${
              event?.venue?.name as string
            }`,
            `https://app.metapasshq.xyz/event/${event?.childAddress as string}`,
            emails[0].body,
          );
          await axios.post('/api/sendRegisteredEmail', {
            email: user?.email,
            message: body,
            subject: emails[0].subject,
          });
        } else {
          console.log('no registration email');
        }
        setToUpdate(!toUpdate);
      }
      setIsLoading(false);
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='lg'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center'>Register Form</ModalHeader>
        <ModalCloseButton _focus={{}} _active={{}} />
        <ModalBody py='6'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex
              justifyContent='center'
              alignItems='center'
              w='full'
              direction='column'
              gap='3'
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
                      <Text ml={-2} color='red'>
                        *
                      </Text>
                    )}
                  </Box>
                  <Flex gap='2' alignItems='center'>
                    <Input
                      placeholder={ques.val}
                      w='md'
                      isRequired={ques.isRequired}
                      isReadOnly={ques.id === 3 || ques.id == 2}
                      value={
                        ques.id == 2
                          ? user?.email
                          : ques.id == 3
                          ? wallet?.address
                          : null
                      }
                      defaultValue={
                        ques.id == 2
                          ? user?.email
                          : ques.id == 3
                          ? wallet?.address
                          : null
                      }
                      {...register(camelize(ques.val))}
                    />
                  </Flex>
                </FormControl>
              ))}
              {formData?.data?.customQues?.map((ques) => (
                <FormControl key={ques.id}>
                  <Box display={'flex'} justifyContent={'start'}>
                    <FormLabel>{ques.val}</FormLabel>
                    {ques.isRequired && (
                      <Text ml={-2} color='red'>
                        *
                      </Text>
                    )}
                  </Box>
                  <Flex gap='2' alignItems='center'>
                    <Input
                      placeholder={ques.val}
                      w='md'
                      isRequired={ques.isRequired}
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
                );
              })}
              <Button
                bg={'brand.gradient'}
                fontWeight='500'
                _focus={{}}
                _hover={{ bg: 'brand.gradient' }}
                _active={{}}
                w='28'
                type='submit'
                isLoading={isLoading}
                textColor='white'
              >
                Submit
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

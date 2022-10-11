declare let window: any;

import type { NextComponentType, NextPageContext } from 'next';
import type { ModalProps } from '../../types/ModalProps.types';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Flex,
  Image,
  Input,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '../../lib/config/supabaseConfig';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { MdEmail } from 'react-icons/md';

const SignUpModal: NextComponentType<NextPageContext, {}, ModalProps> = ({
  isOpen,
  onOpen,
  onClose,
}) => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);

  const signIn = async (provider: 'google' | 'twitter') => {
    const { user, session, error } = await supabase.auth.signIn(
      {
        provider: provider,
      },
      {
        redirectTo: window?.location.href,
      },
    );
  };

  const sendEmailLink = async () => {
    setLoading(true);
    if (email !== '' || undefined) {
      const { user, session, error } = await supabase.auth.signIn(
        {
          email: email,
        },
        { redirectTo: window?.location.href },
      );

      toast.success('Success! Sent email link to sign in');
      setLoading(false);
    } else {
      toast.error('Enter some value first');
    }
    setLoading(false);
  };

  return (
    <>
      <Modal isOpen onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          animate={{
            opacity: 1,
            y: 0,
          }}
          as={motion.div}
          initial={{
            opacity: 0,
            y: -200,
          }}
        >
          <Flex justify='center'>
            <Image
              src='/assets/bolt.svg'
              maxH='28'
              maxW='28'
              pos='absolute'
              zIndex='overlay'
              top='-14'
              alt='bolt'
            />
          </Flex>

          <ModalHeader textAlign='center' mt='8'>
            Get Started
          </ModalHeader>
          <ModalCloseButton _focus={{}} />
          <ModalBody
            display='flex'
            flexDir='column'
            justifyContent='center'
            alignItems='center'
            gap='3'
            pb='8'
          >
            <Input
              placeholder='Enter email...'
              w='72'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              rounded='lg'
            />
            <Button
              bg='brand.gradient'
              w='64'
              rounded='md'
              _hover={{}}
              _focus={{}}
              _active={{}}
              textColor='white'
              onClick={sendEmailLink}
              isLoading={isLoading}
              gap='2'
              alignItems='center'
              as={motion.button}
              whileHover={{ scale: 0.99 }}
              whileTap={{ scale: 1.01 }}
              transitionDuration='25ms'
            >
              <MdEmail size={22} />
              Continue
            </Button>
            <Text fontFamily='heading' fontWeight='500' fontSize='xl'>
              or
            </Text>
            <Button
              w='72'
              variant='outline'
              gap='2'
              _focus={{}}
              onClick={() => signIn('google')}
              rounded='lg'
              shadow='sm'
            >
              <FcGoogle size={25} />
              Continue with google
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignUpModal;

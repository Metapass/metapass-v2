import {
  Modal,
  ModalOverlay,
  Image,
  ModalContent,
  ModalBody,
  Flex,
  Text,
  Circle,
  Fade,
  SlideFade,
  Divider,
} from '@chakra-ui/react';
import React from 'react';
import { FaWallet } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

interface props {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  handleEmail: () => void;
  onWalletOpen: () => void;
}
export default function WalletSignUpModal({
  isOpen,
  onClose,
  onOpen,
  handleEmail,
  onWalletOpen,
}: props) {
  const items = [
    {
      title: 'Sign In With Email',
      description: 'Sign in with email or google. Powered by Web3Auth',
      connector: async () => {
        await handleEmail();
        // onClose()
      },
      image: '/assets/elements/email.svg',
      size: '2.5rem',
    },
    {
      title: 'Connect Wallet',
      description: 'Connect your web3 wallet',
      connector: () => {
        onClose();
        onWalletOpen();
      },
      image:
        'https://res.cloudinary.com/dev-connect/image/upload/v1664521612/img/walletline_bjuq9f.svg',
      size: '10rem',
    },
  ];
  return (
    <SlideFade in={isOpen}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          rounded='xl'
          mx={{ base: '1rem', md: 'auto' }}
          mt={{ base: '60%', md: '10%' }}
        >
          <ModalBody m={2} p={4}>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <Flex
                  w='full'
                  flexDirection='column'
                  alignItems='center'
                  borderRadius='md'
                  as='button'
                  rounded='xl'
                  _hover={{ bg: 'gray.100' }}
                  onClick={item.connector}
                  minH='11rem'
                >
                  <Flex
                    justify='space-between'
                    alignItems='center'
                    px='4'
                    // py="4"
                    mt='4'
                  >
                    <Text fontSize='lg' fontWeight='medium'>
                      {item.title}
                    </Text>
                  </Flex>
                  <Circle p='1rem'>
                    <Image src={item.image} alt={item.title} w={item.size} />
                  </Circle>
                  <Flex
                    justify='space-between'
                    alignItems='center'
                    px='4'
                    // py="4"
                  >
                    <Text fontSize='md' fontWeight='normal' color='gray.400'>
                      {item.description}
                    </Text>
                  </Flex>
                </Flex>
                {index !== items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </SlideFade>
  );
}

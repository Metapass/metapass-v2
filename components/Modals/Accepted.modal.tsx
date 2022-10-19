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
  Box,
  Link as ChakraLink,
  useClipboard,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FC } from 'react';
import { IoIosLink } from 'react-icons/io';

interface AcceptedModalComponentProps {
  isApproved: boolean;
  event: any;
  mail: string;
}

const AcceptedModalComponent: FC<AcceptedModalComponentProps> = ({
  isApproved,
  event,
  mail,
}) => {
  return (
    <Modal isOpen={isApproved as boolean} onClose={() => {}}>
      <ModalOverlay />

      <ModalContent rounded='2xl'>
        <ModalBody textAlign='center'>
          <Image
            src='/assets/elements/sparkle_3.svg'
            alt='sparkle'
            w='28'
            mx='auto'
            h='28'
          />
          <Text fontFamily='body' fontSize='xl' color='blackAlpha.800'>
            Radical! 🎊
          </Text>
          <Box mt='6'>
            <Text mt='2' color='blackAlpha.700' fontSize='lg'>
              You've been approved for
            </Text>
            <Text
              as='h3'
              fontSize='2xl'
              color='brand.black'
              fontWeight='semibold'

              // letterSpacing="wide"
            >
              {event.title}
            </Text>
            <Text color='blackAlpha.700' fontSize='md' mt='4'>
              We've sent an approval email with your QR code to{' '}
              {/* <Text
                                as="span"
                                variant="none"
                                background="brand.gradient"
                                backgroundClip="text"
                                fontWeight="semibold"
                            >
                                approval email
                            </Text>{' '}
                            with your{' '}
                            <Text
                                as="span"
                                variant="none"
                                background="brand.gradient"
                                backgroundClip="text"
                                fontWeight="semibold"
                            >
                                QR Code
                            </Text>{' '} */}
              <Text
                as='span'
                variant='none'
                background='brand.gradient'
                backgroundClip='text'
                fontWeight='semibold'
              >
                {mail}
              </Text>{' '}
              and you'll find the ticket in your wallet
            </Text>
          </Box>
          {/* <Flex
                        mx="auto"
                        mt="2"
                        justify="center"
                        experimental_spaceX="2"
                        align="center"
                    >
                        <Box
                            p="2"
                            bg="white"
                            transitionDuration="100ms"
                            cursor="pointer"
                            boxShadow="0px 4.61667px 92.3333px rgba(0, 0, 0, 0.15)"
                            rounded="full"
                            _hover={{ shadow: 'md' }}
                        >
                            <Image
                                src="/assets/twitter.png"
                                w="5"
                                alt="twitter"
                                onClick={() => {
                                    window.open(
                                        `http://twitter.com/share?text=I just created NFT Ticketed event for ${event.title} on Metapass. Get your NFT Ticket now!&url=https://app.metapasshq.xyz/event/${child}`,
                                        '_blank'
                                    )
                                }}
                            />
                        </Box>
                        <Box
                            p="2"
                            bg="white"
                            transitionDuration="100ms"
                            cursor="pointer"
                            boxShadow="0px 4.61667px 92.3333px rgba(0, 0, 0, 0.15)"
                            rounded="full"
                            _hover={{ shadow: 'md' }}
                        >
                            <Image
                                src="/assets/whatsapp.png"
                                w="5"
                                alt="whatsapp"
                                onClick={() => {
                                    window.open(
                                        `https://api.whatsapp.com/send?text=I just created NFT Ticketed event for ${event.title} on Metapass. Get your NFT Ticket now at https://app.metapasshq.xyz/event/${child}`
                                    )
                                }}
                            />
                        </Box>
                        <Box
                            p="2"
                            bg="white"
                            transitionDuration="100ms"
                            cursor="pointer"
                            boxShadow="0px 4.61667px 92.3333px rgba(0, 0, 0, 0.15)"
                            rounded="full"
                            _hover={{ shadow: 'md' }}
                        >
                            <Image
                                src="/assets/telegram.png"
                                w="5"
                                alt="telegram"
                                onClick={() => {
                                    window.open(
                                        `https://telegram.me/share/url?url=https://app.metapasshq.xyz/event/${child}&text=I just created NFT Ticketed event for ${event.title} on Metapass. Get your NFT Ticket now.`,
                                        '_blank'
                                    )
                                }}
                            />
                        </Box>
                    </Flex> */}
          {/* <Text color="blackAlpha.700" fontSize="sm" mt="2">
                        Or copy link
                    </Text> */}
          {/* <InputGroup mt="4">
                        <InputLeftElement>
                            <IoIosLink />
                        </InputLeftElement>
                        <Input
                            rounded="full"
                            fontSize="xs"
                            value={eventLink}
                            readOnly
                        />
                        <InputRightElement mr="6">
                            <Button
                                onClick={onCopy}
                                _hover={{}}
                                _focus={{}}
                                _active={{}}
                                rounded="full"
                                color="white"
                                bg="brand.gradient"
                                fontWeight="normal"
                                fontSize="sm"
                                px="12"
                                roundedBottomLeft="none"
                            >
                                {hasCopied ? 'Copied' : 'Copy Link'}
                            </Button>
                        </InputRightElement>{' '}
                    </InputGroup> */}
          {/* <Box
                        p="1.5px"
                        mx="auto"
                        mt="6"
                        transitionDuration="200ms"
                        rounded="full"
                        w="fit-content"
                        boxShadow="0px 5px 33px rgba(0, 0, 0, 0.08)"
                        bg="brand.gradient"
                        _hover={{ transform: 'scale(1.05)' }}
                        _focus={{}}
                        _active={{ transform: 'scale(0.95)' }}
                    >
                        <Button
                            type="submit"
                            rounded="full"
                            bg="white"
                            size="sm"
                            color="blackAlpha.700"
                            fontWeight="medium"
                            _hover={{}}
                            leftIcon={
                                <Box
                                    _groupHover={{
                                        transform: 'scale(1.1)',
                                    }}
                                    transitionDuration="200ms"
                                >
                                    <Image
                                        src="/assets/elements/event_ticket_gradient.svg"
                                        w="4"
                                        alt="ticket"
                                    />
                                </Box>
                            }
                            _focus={{}}
                            _active={{}}
                            onClick={() => {
                                window.open(`mailTo`, '_blank')
                            }}
                            role="group"
                        >
                            Go to mail
                        </Button>
                    </Box> */}
          <Box mt='2' mb='4'>
            <Link href='/' passHref>
              <ChakraLink fontSize='sm' color='blackAlpha.600'>
                Back to home
              </ChakraLink>
            </Link>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AcceptedModalComponent;

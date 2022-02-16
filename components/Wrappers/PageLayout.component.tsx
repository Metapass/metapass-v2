import { Button, Flex, Box, Link } from '@chakra-ui/react'
import { IoIosAdd } from 'react-icons/io'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import NextLink from 'next/link'

export default function PageLayout({ children }: any) {
    const [isScrolling, setScrolling] = useState(true)
    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 240) {
                setScrolling(false)
            } else {
                setScrolling(true)
            }
        })
    }, [])

    return (
        <Box position="relative" w="full">
            {children}

            <AnimatePresence>
                {!isScrolling && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.2 }}
                        animate={{ opacity: [0, 1], scale: [0, 1] }}
                        exit={{ scale: [1, 0] }}
                        style={{
                            width: 'fit-content',
                            position: 'fixed',
                            zIndex: 999,
                            bottom: 20,
                            right: 25,
                        }}
                    >
                        <Box
                            p="1.5px"
                            transitionDuration="200ms"
                            rounded="full"
                            boxShadow="0px 5px 33px rgba(0, 0, 0, 0.08)"
                            bg="brand.gradient"
                            _hover={{ transform: 'scale(1.05)' }}
                            _focus={{}}
                            _active={{ transform: 'scale(0.95)' }}
                        >
                            <NextLink href="/create" passHref>
                                <Link _hover={{}} _focus={{}} _active={{}}>
                                    {' '}
                                    <Button
                                        pl="1.5"
                                        rounded="full"
                                        bg="white"
                                        color="blackAlpha.700"
                                        fontWeight="medium"
                                        _hover={{}}
                                        _focus={{}}
                                        _active={{}}
                                        role="group"
                                        leftIcon={
                                            <Flex
                                                _groupHover={{}}
                                                transitionDuration="200ms"
                                                justify="center"
                                                alignItems="center"
                                                color="white"
                                                bg="brand.gradient"
                                                rounded="full"
                                                p="0.5"
                                            >
                                                <IoIosAdd size="25px" />
                                            </Flex>
                                        }
                                    >
                                        Create Event
                                    </Button>
                                </Link>
                            </NextLink>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    )
}

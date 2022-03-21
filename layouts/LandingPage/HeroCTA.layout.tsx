import { Box, Flex, Text, Image } from '@chakra-ui/react'
import SearchBar from '../../components/Elements/SearchBar.component'
import NavigationBar from '../../components/Navigation/NavigationBar.component'

export default function HeroCTA() {
    return (
        <>
            <Box
                backgroundImage={`url("/assets/gradient.png")`}
                backgroundSize="cover"
                backgroundRepeat="no-repeat"
                position="relative"
                overflow="hidden"
            >
                <Box display={{ base: 'none', md: 'block' }}>
                    <video
                        autoPlay
                        muted
                        loop
                        id="myVideo"
                        style={{
                            position: 'absolute',
                            top: 0,
                            zIndex: 0,
                            minHeight: '100%',
                            minWidth: '100%',
                        }}
                    >
                        <source src="/assets/gradient.mp4" type="video/mp4" />
                    </video>
                </Box>
                <NavigationBar />
                <Box
                    textAlign="center"
                    color="white"
                    pb="12"
                    mt={{ base: '5', md: '6' }}
                    mb={{ base: '6', md: '12' }}
                    zIndex={2}
                    position="relative"
                >
                    <Flex justify="center" ml={{ lg: '12' }}>
                        <Text
                            textAlign="center"
                            fontFamily="azonix"
                            fontSize={{
                                base: '4xl',
                                md: '6xl',
                                lg: '6xl',
                                xl: '7xl',
                            }}
                        >
                            METAPASS
                        </Text>
                        <Image
                            w={{ base: '5', lg: '10' }}
                            ml={{ base: '0', lg: '1' }}
                            mt={{ base: '-12', lg: '-20' }}
                            src="/assets/elements/sparkle.svg"
                            alt="element"
                        />
                    </Flex>
                    <Text
                        textAlign="center"
                        fontWeight={{ base: 'medium', lg: 'semibold' }}
                        fontFamily="subheading"
                        ml={{ base: '-6', lg: '0' }}
                        fontSize={{
                            base: '13.8px',
                            md: '23.2px',
                            lg: '23.2px',
                            xl: '28',
                        }}
                        mt={{ base: '-2', lg: '-5' }}
                    >
                        Buy or sell NFT tickets to events
                    </Text>
                </Box>
            </Box>
            <Flex justify="center" w="full" position="relative" zIndex={999}>
                <Box
                    mx={{ base: '2', md: '10', xl: '32' }}
                    maxW="1200px"
                    w="full"
                    transform="translateY(-30px)"
                >
                    <SearchBar />
                </Box>
            </Flex>
        </>
    )
}

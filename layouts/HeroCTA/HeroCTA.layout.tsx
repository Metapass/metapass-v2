import { Box, Flex, Text, Image } from "@chakra-ui/react";
import SearchBar from "../../components/Elements/SearchBar.component";
import NavigationBar from "../../components/Navigation/NavigationBar.component";

export default function HeroCTA() {
  return (
    <>
      <Box
        backgroundImage={`url("assets/gradient.gif")`}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        position="relative"
        overflow="hidden"
      >
        <video
          autoPlay
          muted
          loop
          id="myVideo"
          style={{ position: "absolute", top: 0, zIndex: 0, minWidth: "100%" }}
        >
          <source src="assets/gradient.mp4" type="video/mp4" />
        </video>
        <NavigationBar />
        <Box
          textAlign="center"
          color="white"
          pb="12"
          mt="10"
          mb="20"
          zIndex={2}
          position="relative"
        >
          <Flex justify="center" ml="12">
            <Text
              textAlign="center"
              fontFamily="azonix"
              fontSize={{ md: "6xl", lg: "7xl" }}
            >
              METAPASS
            </Text>
            <Image
              w={{ md: "8", lg: "10" }}
              ml="1"
              mt="-20"
              src="assets/elements/sparkle.svg"
              alt="element"
            />
          </Flex>
          <Text
            textAlign="center"
            fontWeight="semibold"
            fontFamily="subheading"
            fontSize={{ md: "23.3px", lg: "28px" }}
            mt="-5"
          >
            Buy or sell NFT tickets to events
          </Text>
        </Box>
      </Box>
      <Flex justify="center" w="full">
        <Box
          mx={{ lg: "10", xl: "32" }}
          maxW="1200px"
          w="full"
          transform="translateY(-30px)"
        >
          <SearchBar />
        </Box>
      </Flex>
    </>
  );
}

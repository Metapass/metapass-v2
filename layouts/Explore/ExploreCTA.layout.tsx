import { Box, Flex, Text, Image } from "@chakra-ui/react";
import SearchBar from "../../components/Elements/SearchBar.component";
import NavigationBar from "../../components/Navigation/NavigationBar.component";

export default function ExploreCTA() {
  return (
    <>
      <Box
        backgroundImage={`url("assets/gradient.png")`}
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
          style={{
            position: "absolute",
            top: 0,
            zIndex: 0,
            minWidth: "100%",
          }}
        >
          <source src="/assets/gradient.mp4" type="video/mp4" />
        </video>
        <NavigationBar />
        <Box
          textAlign="center"
          color="white"
          pb="10"
          mt="6"
          mb="10"
          zIndex={2}
          position="relative"
        >
          <Flex justify="center" ml="12">
            <Text
              textAlign="center"
              fontFamily="azonix"
              fontSize={{ md: "4xl", lg: "4xl", xl: "5xl" }}
            >
              EXPLORE EVENTS
            </Text>
            <Image
              w={{ md: "6", lg: "8" }}
              ml="1"
              mt="-16"
              src="assets/elements/sparkle.svg"
              alt="element"
            />
          </Flex>
        </Box>
      </Box>
      <Flex justify="center" w="full" position="relative" zIndex={999}>
        <Box
          mx={{ base: "10", xl: "32" }}
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

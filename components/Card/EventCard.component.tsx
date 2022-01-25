import { AspectRatio, Box, Flex, Image, Text } from "@chakra-ui/react";

export default function EventCard() {
  return (
    <Box
      rounded="xl"
      overflow="hidden"
      bg="white"
      boxShadow="0px -4px 52px rgba(0, 0, 0, 0.11)"
      maxW="400px"
      border="1px"
      position="relative"
      borderColor="blackAlpha.200"
    >
      <Box
        zIndex={2}
        rounded="full"
        fontSize="xs"
        fontWeight="semibold"
        px="2"
        py="1"
        bg="white"
        position="absolute"
        top="2"
        left="2"
        color="blackAlpha.700"
      >
        $200
      </Box>
      <Box
        zIndex={2}
        rounded="full"
        fontSize="xs"
        fontWeight="semibold"
        px="2"
        py="1"
        bg="white"
        position="absolute"
        top="2"
        right="2"
        color="blackAlpha.500"
      >
        Meetup
      </Box>
      <AspectRatio ratio={428.42 / 180.98} w="full">
        <Image
          w="full"
          src="https://assets.entrepreneur.com/content/3x2/2000/20160321103826-shutterstock-217119211.jpeg"
          alt="event image"
        />
      </AspectRatio>
      <Flex p="4" alignItems="center">
        <Box
          textAlign="center"
          borderRight="2px"
          borderColor="blackAlpha.200"
          px="4"
          h="fit-content"
          mr="6"
        >
          <Text fontFamily="body" fontWeight="bold" color="brand.peach">
            AUG
          </Text>
          <Text fontSize="2xl" color="brand.black600" fontWeight="medium">
            25
          </Text>
        </Box>
        <Box>
          <Text fontSize="xl" fontWeight="semibold" color="brand.black600">
            Web Summit Pitch 2022
          </Text>
          <Flex color="blackAlpha.700" fontSize="xs" experimental_spaceX="1">
            <Text>by</Text>
            <Text fontWeight="medium">Shawn Doe</Text>
          </Flex>
          <Text mt="1" color="blackAlpha.600" fontFamily="body" fontSize="sm">
            The Abcd Company’s official community meetup for 2022 is here!
          </Text>
        </Box>
      </Flex>
      <Flex justify="end">
        <Box
          bg="white"
          rounded="full"
          p="1"
          px="3"
          roundedRight="none"
          transform="translateY(-6px)"
          w="fit-content"
          fontSize="sm"
          boxShadow="0px 6.36032px 39.752px rgba(0, 0, 0, 0.07)"
        >
          <Flex experimental_spaceX="1">
            <Text
              fontWeight="bold"
              style={{
                background:
                  "-webkit-linear-gradient(360deg, #95E1FF 0%, #E7B0FF 51.58%, #FFD27B 111.28%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              13/40
            </Text>
            <Text color="blackAlpha.500">Tickets Left</Text>
          </Flex>
        </Box>
      </Flex>
      <Box w="full" h="6" bg="blackAlpha.50" mt="-5">
        <Box w="70%" h="full" bg="brand.gradient" />
      </Box>
    </Box>
  );
}

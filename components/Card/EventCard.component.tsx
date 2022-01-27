import { AspectRatio, Box, Flex, Image, Link, Text } from "@chakra-ui/react";
import { Event } from "../../types/Event.type";

export default function EventCard({ event }: { event: Event }) {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  return (
    <Box
      rounded="lg"
      overflow="hidden"
      bg="white"
      _hover={{ transform: "scale(1.01)" }}
      _active={{ transform: "scale(1.03)" }}
      transitionDuration="200ms"
      cursor="pointer"
      boxShadow="0px -4px 52px rgba(0, 0, 0, 0.11)"
      maxW="390px"
      minW="390px"
      border="1px"
      position="relative"
      borderColor="blackAlpha.200"
    >
      <Box
        zIndex={2}
        rounded="full"
        fontSize="10px"
        fontWeight="semibold"
        px="2"
        py="0.5"
        bg="white"
        position="absolute"
        top="2"
        left="2"
        color="blackAlpha.700"
      >
        {"$"}
        {event.price}
      </Box>
      <Flex
        zIndex={2}
        position="absolute"
        top="2"
        right="2"
        experimental_spaceX="2"
        color="blackAlpha.600"
      >
        <Box
          rounded="full"
          fontSize="10px"
          fontWeight="semibold"
          px="2"
          py="0.5"
          bg="white"
        >
          {event.type}
        </Box>
        <Box
          rounded="full"
          fontSize="10px"
          fontWeight="semibold"
          px="2"
          py="0.5"
          bg="white"
        >
          {event.category}
        </Box>
      </Flex>
      <AspectRatio ratio={428.42 / 180.98} w="full">
        <Image w="full" src={event.image} alt="event image" />
      </AspectRatio>
      <Flex p="4" alignItems="center">
        <Box
          textAlign="center"
          borderRight="2px"
          borderColor="blackAlpha.200"
          px="2"
          pr="5"
          h="fit-content"
          mr="6"
        >
          <Text
            fontSize="sm"
            fontFamily="body"
            fontWeight="bold"
            color="brand.peach"
          >
            {months[event.date.month]}
          </Text>
          <Text fontSize="xl" color="brand.black600" fontWeight="medium">
            {event.date.date}
          </Text>
        </Box>
        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="brand.black600">
            {event.title}
          </Text>
          <Flex color="blackAlpha.700" fontSize="xs" experimental_spaceX="1">
            <Text>by</Text>
            <Link
              fontWeight="medium"
              maxW="100px"
              noOfLines={1}
              _hover={{ color: "brand.black600" }}
            >
              {event.owner}
            </Link>
          </Flex>
          <Text
            mt="1"
            color="blackAlpha.500"
            fontFamily="body"
            fontSize="sm"
            noOfLines={2}
          >
            {event.description}
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
          transform="translateY(-4px)"
          w="fit-content"
          fontSize="xs"
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
              {event.tickets_available - event.tickets_sold}/
              {event.tickets_available}
            </Text>
            <Text color="blackAlpha.500">Tickets Left</Text>
          </Flex>
        </Box>
      </Flex>
      <Box w="full" h="5" bg="blackAlpha.50" mt="-4">
        <Box
          w={`${(event.tickets_sold / event.tickets_available) * 100}%`}
          h="full"
          bg="brand.gradient"
        />
      </Box>
    </Box>
  );
}

import { Box, Flex, Text, Image } from "@chakra-ui/react";
import EventCard from "../../components/Card/EventCard.component";

export default function FeaturedEvents() {
  return (
    <Flex w="full" justify="center">
      <Box maxW="1200px" mx={{ lg: "12", xl: "40" }} w="full" pb="20">
        <Flex>
          <Text fontWeight="medium" color="brand.black" fontSize="4xl">
            Featured Events
          </Text>
          <Image
            w="6"
            mt="-8"
            src="assets/elements/sparkle_dark.svg"
            alt="element"
          />
        </Flex>
        <Flex my="8" experimental_spaceX="8">
          <EventCard />
          <EventCard />
        </Flex>
      </Box>
    </Flex>
  );
}

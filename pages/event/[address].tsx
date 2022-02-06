import { Box, Flex } from "@chakra-ui/react";
import type { NextPage } from "next";
import EventCard from "../../components/Card/EventCard.component";

import NavigationBar from "../../components/Navigation/NavigationBar.component";
import EventLayout from "../../layouts/Event/Event.layout";
import EventPageCTA from "../../layouts/EventPage/EventPageCTA.layout";
import { events } from "../../utils/testData";

const Event: NextPage = () => {
  return (
    <Box minH="100vh" h="full" overflow="hidden" bg="blackAlpha.50">
      <EventPageCTA />
      <Flex
        justify="center"
        mx="auto"
        mt="6"
        px="6"
        w="full"
        maxW="1400px"
        experimental_spaceX="10"
      >
        <Box maxW="1000px" w="full">
          <EventLayout event={events[0]} />
        </Box>
      </Flex>
    </Box>
  );
};

export default Event;

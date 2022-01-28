import { Box, Grid } from "@chakra-ui/react";
import EventCard from "../../components/Card/EventCard.component";
import FeaturedEventCard from "../../components/Card/FeaturedEventCard.component";
import { events } from "../../utils/testData";

export default function QueriedEvents() {
  return (
    <Box>
      <Grid
        templateColumns={{
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(3, 1fr)",
        }}
        px="10"
        gap={6}
      >
        {events.map((data, key) => (
          <Box maxW={{ xl: "390px" }} minW={{ xl: "390px" }} key={key}>
            <EventCard event={data} />
          </Box>
        ))}
      </Grid>
    </Box>
  );
}

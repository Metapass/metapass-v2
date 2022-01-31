import { Box, Flex, Text, Image, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import EventCard from "../../components/Card/EventCard.component";
import { events } from "../../utils/testData";
import ScrollContainer from "react-indiana-drag-scroll";
import { ChevronRight } from "@mui/icons-material";

export default function FeaturedEvents() {
  return (
    <Flex w="full" justify="center" mb="-48">
      <Box w="full" pb="20">
        <Flex maxW="1200px" mx={{ base: "12", xl: "40" }}>
          <Text
            fontWeight="medium"
            color="brand.black"
            fontSize={{ base: "3xl", xl: "4xl" }}
            position="relative"
          >
            Featured Events
          </Text>
          <Image
            w={{ lg: "5", xl: "6" }}
            mt="-8"
            src="assets/elements/sparkle_dark.svg"
            alt="element"
          />
        </Flex>
        <Flex _active={{ cursor: "grabbing" }} my="8">
          <ScrollContainer
            style={{
              paddingTop: "100px",
              paddingBottom: "100px",

              transform: "translateY(-100px)",
            }}
          >
            <Flex experimental_spaceX="8" mx={{ base: "10", xl: "20" }}>
              {events.map((data, key) => (
                <Box
                  maxW={{ base: "330px", xl: "390px" }}
                  key={key}
                  minW={{ base: "330px", xl: "390px" }}
                >
                  <EventCard event={data} />
                </Box>
              ))}
              <Box p="10" />
            </Flex>
          </ScrollContainer>
        </Flex>
        <Flex justify="center" transform="translateY(-160px)">
          <Button
            size="lg"
            rounded="full"
            bg="brand.gradient"
            color="white"
            rightIcon={
              <Flex
                justify="center"
                alignItems="center"
                transitionDuration="200ms"
                _groupHover={{ transform: "translateX(4px)" }}
              >
                <ChevronRight />
              </Flex>
            }
            _hover={{}}
            _focus={{}}
            _active={{}}
            py="7"
            role="group"
            fontWeight="medium"
            px="8"
            onClick={() => window.location.replace("/explore")}
          >
            Explore all events
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
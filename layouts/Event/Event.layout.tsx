import {
  AspectRatio,
  Box,
  Flex,
  Text,
  Image,
  Button,
  Divider,
  Avatar,
  AvatarGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import ReactPlayer from "react-player";
import { Event } from "../../types/Event.type";
import { getParameterByName } from "../../utils/queryExtractor";
import { users } from "../../utils/testData";

export default function EventLayout({ event }: { event: Event }) {
  const [image, setImage] = useState(event.image);
  const [mediaType, setMediaType] = useState(event.video ? "video" : "image");

  return (
    <Box p="2" pt="3" color="brand.black" mb="4">
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="semibold">
            {event.title}
          </Text>
          <Flex experimental_spaceX="2" color="blackAlpha.600" mt="1">
            <Box
              boxShadow="0px 0px 31.1248px rgba(0, 0, 0, 0.08)"
              rounded="full"
              fontSize="10px"
              fontWeight="semibold"
              border="1px"
              borderColor="blackAlpha.200"
              px="2"
              py="0.5"
              bg="white"
            >
              {event.type}
            </Box>
            <Box
              boxShadow="0px 0px 31.1248px rgba(0, 0, 0, 0.08)"
              rounded="full"
              fontSize="10px"
              fontWeight="semibold"
              border="1px"
              borderColor="blackAlpha.200"
              px="2"
              py="0.5"
              bg="white"
            >
              {event.category}
            </Box>
          </Flex>
        </Box>
        <Button
          rounded="full"
          bg="brand.gradient"
          fontWeight="medium"
          role="group"
          boxShadow="0px 4px 32px rgba(0, 0, 0, 0.12)"
          color="white"
          _disabled={{ opacity: "0.8", cursor: "not-allowed" }}
          _hover={{}}
          disabled={event.tickets_available === event.tickets_sold}
          _focus={{}}
          _active={{}}
          leftIcon={
            <Box
              _groupHover={{ transform: "scale(1.1)" }}
              transitionDuration="200ms"
            >
              <Image
                src="assets/elements/event_ticket.svg"
                w="5"
                alt="ticket"
              />
            </Box>
          }
        >
          {event.tickets_available === event.tickets_sold
            ? "Sold Out"
            : "Buy Ticket"}
        </Button>
      </Flex>
      <Flex
        align="start"
        mt="4"
        experimental_spaceX="6"
        justify="space-between"
      >
        <Box w="full">
          <Box
            w="full"
            overflow="auto"
            border="1px"
            borderColor="blackAlpha.100"
            boxShadow="0px 4.25554px 93.6219px rgba(0, 0, 0, 0.08)"
            rounded="xl"
            p="3"
          >
            <Flex alignItems="end" experimental_spaceX="4">
              <AspectRatio
                ratio={16 / 9}
                w="full"
                rounded="lg"
                overflow="hidden"
              >
                {mediaType === "video" ? (
                  <Flex justify="center" align="center" w="full">
                    <ReactPlayer height="100%" width="100%" url={event.video} />
                  </Flex>
                ) : (
                  <Image src={image} alt={image} />
                )}
              </AspectRatio>
              <Box
                maxH={{ base: "26vw", xl: "300px" }}
                minW={{ md: "100px", lg: "130px" }}
                overflowY="auto"
              >
                <Flex
                  px="1"
                  py="1"
                  direction="column"
                  minW={{ md: "90px", lg: "110px" }}
                  experimental_spaceY="2"
                >
                  {event.video && (
                    <AspectRatio
                      cursor="pointer"
                      _hover={{ filter: "brightness(90%)" }}
                      transitionDuration="100ms"
                      onClick={() => {
                        setMediaType("video");
                      }}
                      ratio={16 / 9}
                      w="full"
                      ringColor="brand.peach"
                      ring={mediaType === "video" ? "2px" : "none"}
                      rounded="md"
                      overflow="hidden"
                    >
                      <Image
                        src={
                          getParameterByName("v", event.video)
                            ? `https://img.youtube.com/vi/${getParameterByName(
                                "v",
                                event.video
                              )}/0.jpg`
                            : "https://pdtxar.com/wp-content/uploads/2019/11/video-placeholder-1280x720-40-768x433.jpg"
                        }
                        alt={event.video}
                      />
                    </AspectRatio>
                  )}
                  {event.slides.map((data, key) => (
                    <AspectRatio
                      key={key}
                      cursor="pointer"
                      _hover={{ filter: "brightness(90%)" }}
                      transitionDuration="100ms"
                      onClick={() => {
                        setImage(data);
                        setMediaType("image");
                      }}
                      ratio={16 / 9}
                      w="full"
                      ringColor="brand.peach"
                      ring={
                        image === data && mediaType === "image" ? "2px" : "none"
                      }
                      rounded="md"
                      overflow="hidden"
                    >
                      <Image src={data} alt={data} />
                    </AspectRatio>
                  ))}
                </Flex>
              </Box>
            </Flex>
          </Box>
          <Box
            w="full"
            mt="2"
            noOfLines={6}
            border="1px"
            borderColor="blackAlpha.100"
            boxShadow="0px 4.25554px 93.6219px rgba(0, 0, 0, 0.08)"
            rounded="xl"
            p="3"
            fontFamily="body"
            px="4"
            color="blackAlpha.600"
            fontSize={{ base: "sm", lg: "md" }}
          >
            {event.long_description || event.description}
          </Box>
        </Box>
        <Flex direction="column">
          <Flex experimental_spaceX="2.5">
            <Box
              p="2"
              border="1px"
              borderColor="blackAlpha.100"
              rounded="xl"
              textAlign="center"
              minW="100px"
              boxShadow="0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)"
            >
              <Text fontSize="xs" color="blackAlpha.700">
                Ticket Price
              </Text>
              <Divider my="2" />
              <Box w="fit-content" mx="auto">
                <Image src="assets/matic.png" alt="matic" w="6" h="6" />
              </Box>
              <Text fontSize="2xl" fontWeight="semibold">
                {event.price}
              </Text>
            </Box>
            <Box
              p="2"
              border="1px"
              borderColor="blackAlpha.100"
              rounded="xl"
              textAlign="center"
              minW="100px"
              boxShadow="0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)"
            >
              <Text fontSize="xs" color="blackAlpha.700">
                Event Date
              </Text>
              <Divider my="2" />
              <Text color="brand.peach">AUG</Text>
              <Text fontSize="2xl" fontWeight="semibold">
                {event.date.date}
              </Text>
            </Box>
          </Flex>
          <Box
            mt="3"
            rounded="xl"
            px="4"
            border="1px"
            borderColor="blackAlpha.100"
            boxShadow="0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)"
            py="2"
          >
            <Text color="blackAlpha.500" fontSize="xs">
              Hosted By
            </Text>
            <Flex mt="2" direction="column" mb="1">
              {event.hosts.map((data, key) => (
                <Flex
                  key={key}
                  experimental_spaceX="2"
                  align="center"
                  _hover={{ bg: "blackAlpha.50" }}
                  mx="-4"
                  px="4"
                  py="2"
                  cursor="pointer"
                  transitionDuration="100ms"
                >
                  <Avatar size="sm" src={users[data].avatar} />
                  <Box>
                    <Text fontSize="13px">{users[data].username}</Text>
                    <Text color="blackAlpha.600" fontSize="xs" noOfLines={1}>
                      {users[data].bio}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Box>
          <Box
            mt="3"
            rounded="xl"
            px="4"
            border="1px"
            borderColor="blackAlpha.100"
            boxShadow="0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)"
            py="2"
          >
            <Text color="blackAlpha.500" fontSize="xs">
              Recent Buyers
            </Text>
            <AvatarGroup mt="2" size="sm" max={6} fontSize="xs" spacing={-2}>
              {event.buyers.reverse().map((data, key) => (
                <Avatar
                  src={users[data].avatar}
                  key={key}
                  cursor="pointer"
                  _hover={{ zIndex: 10 }}
                />
              ))}
            </AvatarGroup>
          </Box>
          <Box
            mt="3"
            rounded="xl"
            px="4"
            border="1px"
            borderColor="blackAlpha.100"
            boxShadow="0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)"
            py="2"
          >
            <Flex justify="space-between" align="center">
              <Text color="blackAlpha.500" fontSize="xs">
                Remaining Tickets
              </Text>
              <Flex fontSize="xs" align="center">
                <Text
                  fontWeight="bold"
                  style={{
                    background:
                      "-webkit-linear-gradient(360deg, #95E1FF 0%, #E7B0FF 51.58%, #FFD27B 111.28%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {event.tickets_available - event.tickets_sold}
                </Text>
                <Text fontSize="xx-small">/</Text>
                <Text> {event.tickets_available}</Text>
              </Flex>
            </Flex>
            <Box
              w="full"
              h="4"
              bg="blackAlpha.50"
              mt="2"
              rounded="full"
              mb="1"
              overflow="hidden"
            >
              <Box
                w={`${(event.tickets_sold / event.tickets_available) * 100}%`}
                h="full"
                bg="brand.gradient"
              />
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

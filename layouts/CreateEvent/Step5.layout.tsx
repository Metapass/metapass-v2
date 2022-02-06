import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

// import { MdCalendarToday as CalendarToday } from "react-icons/md";
import { HiOutlineChevronRight as ChevronRight } from "react-icons/hi";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import EventCard from "../../components/Card/EventCard.component";
import { events } from "../../utils/testData";
import DateModal from "./DateModal.layout";
import { walletContext } from "../../utils/walletContext";
import gravatarUrl from "gravatar-url";
import EventLayout from "../Event/Event.layout";

export default function Step5({
  event,
  onSubmit,
}: {
  event: any;
  onSubmit: Function;
}) {
  const [wallet, setWallet] = useContext(walletContext);

  return (
    <>
      {wallet.address && event.date && event.slides && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Box color="brand.black">
            <Text
              align="center"
              color="brand.black400"
              fontSize="4xl"
              fontWeight="semibold"
            >
              Review the details
            </Text>

            <Flex
              w="full"
              px="20"
              mt="4"
              wrap={{ lg: "wrap", xl: "nowrap" }}
              experimental_spaceY="4"
              justify="center"
              experimental_spaceX="14"
            >
              <Box w="full">
                <Text
                  textAlign="center"
                  fontFamily="body"
                  color="blackAlpha.600"
                  mb="3"
                >
                  Event page
                </Text>
                <Box
                  h="fit-content"
                  w="full"
                  bg="white"
                  px="4"
                  py="2"
                  boxShadow="0px -4.59297px 120.336px rgba(0, 0, 0, 0.06)"
                  rounded="xl"
                >
                  <EventLayout event={event} />
                </Box>
              </Box>
              <Box>
                <Text
                  textAlign="center"
                  fontFamily="body"
                  color="blackAlpha.600"
                  mb="3"
                >
                  Event card
                </Text>
                <Box h="fit-content" w={{ base: "320px", xl: "360px" }}>
                  <EventCard event={event} />
                </Box>
              </Box>
            </Flex>
            <Box align="center" mt="10" mb="20">
              <Button
                size="lg"
                rounded="full"
                type="submit"
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
              >
                Publish Event
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </>
  );
}

import {
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

import { MdCalendarToday as CalendarToday } from "react-icons/md";
import { HiOutlineChevronRight as ChevronRight } from "react-icons/hi";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import EventCard from "../../components/Card/EventCard.component";
import { events } from "../../utils/testData";
import DateModal from "./DateModal.layout";

export default function Step1({ onSubmit }: { onSubmit: Function }) {
  const [isPaid, setIsPaid] = useState(true);
  const [formDetails, setFormDetails] = useState({
    title: "",
    type: "",
    category: "",
    price: 0,
    date: {
      date: 0,
      month: 0,
      year: 0,
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (submitting) {
          onSubmit(formDetails);
        }
      }}
    >
      <Box color="brand.black">
        <DateModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={(date: any) => {
            setFormDetails({
              ...formDetails,
              date,
            });
          }}
        />
        <Text
          align="center"
          color="brand.black400"
          fontSize="4xl"
          fontWeight="semibold"
        >
          Tell us about your event
        </Text>
        <FormControl
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontFamily="body"
          mt="2"
          fontWeight="normal"
        >
          <FormLabel
            fontFamily="body"
            color="blackAlpha.700"
            fontWeight="normal"
            mb="0"
            htmlFor="price"
          >
            Is it a paid event?
          </FormLabel>

          <Switch
            onChange={(e) => {
              setIsPaid(e.target.checked);
            }}
            isChecked={isPaid}
            id="price"
            colorScheme="linkedin"
          />
        </FormControl>
        <Flex
          justify="space-between"
          experimental_spaceX={{ base: "12", xl: "16" }}
          mt="6"
          px="10"
          maxW="1200px"
          mx="auto"
        >
          <Box fontFamily="body" w="full">
            <FormControl
              borderBottom="2px"
              borderBottomColor="gray.200"
              _focusWithin={{ borderBottomColor: "gray.300" }}
            >
              <FormLabel
                fontSize={{ lg: "md", xl: "lg" }}
                color="blackAlpha.700"
                my="0"
              >
                Event Name
              </FormLabel>

              <Input
                onChange={(e) => {
                  setFormDetails({
                    ...formDetails,
                    title: e.target.value,
                  });
                }}
                fontSize="sm"
                value={formDetails.title}
                required
                px="0"
                _placeholder={{ color: "gray.300" }}
                placeholder="Name of your event"
                bg="transparent"
                border="none"
                rounded="none"
                _hover={{}}
                _focus={{}}
                _active={{}}
              />
            </FormControl>
            <Flex experimental_spaceX="8" mt="6">
              <FormControl
                borderBottom="2px"
                borderBottomColor="gray.200"
                _focusWithin={{ borderBottomColor: "gray.300" }}
              >
                <FormLabel
                  fontSize={{ lg: "md", xl: "lg" }}
                  color="blackAlpha.700"
                  my="0"
                >
                  Event Type
                </FormLabel>
                <Menu>
                  <MenuButton type="button" w="full">
                    <InputGroup>
                      <Input
                        fontSize="sm"
                        required
                        px="0"
                        value={formDetails.type}
                        _placeholder={{ color: "gray.300" }}
                        placeholder="Is this event online/in-person?"
                        bg="transparent"
                        border="none"
                        rounded="none"
                        _hover={{}}
                        _focus={{}}
                        _active={{}}
                      />
                      <InputRightElement color="gray.400">
                        <FaChevronDown />
                      </InputRightElement>
                    </InputGroup>
                  </MenuButton>
                  <MenuList
                    rounded="lg"
                    shadow="sm"
                    fontSize="sm"
                    mt="1"
                    zIndex={9}
                  >
                    <MenuItem
                      onClick={(e) => {
                        setFormDetails({
                          ...formDetails,
                          type: "Online",
                        });
                      }}
                    >
                      Online
                    </MenuItem>
                    <MenuDivider color="gray.400" />
                    <MenuItem
                      onClick={(e) => {
                        setFormDetails({
                          ...formDetails,
                          type: "In-person",
                        });
                      }}
                    >
                      In-person
                    </MenuItem>
                  </MenuList>
                </Menu>
              </FormControl>
              <FormControl
                borderBottom="2px"
                borderBottomColor="gray.200"
                _focusWithin={{ borderBottomColor: "gray.300" }}
              >
                <FormLabel
                  fontSize={{ lg: "md", xl: "lg" }}
                  color="blackAlpha.700"
                  my="0"
                >
                  Event Category
                </FormLabel>
                <Menu>
                  <MenuButton type="button" w="full">
                    <InputGroup>
                      <Input
                        fontSize="sm"
                        value={formDetails.category}
                        required
                        px="0"
                        _placeholder={{ color: "gray.300" }}
                        placeholder="Category of your event"
                        bg="transparent"
                        border="none"
                        rounded="none"
                        _hover={{}}
                        _focus={{}}
                        _active={{}}
                      />
                      <InputRightElement color="gray.400">
                        <FaChevronDown />
                      </InputRightElement>
                    </InputGroup>
                  </MenuButton>
                  <MenuList
                    rounded="lg"
                    shadow="sm"
                    fontSize="sm"
                    mt="1"
                    zIndex={9}
                  >
                    <MenuItem
                      onClick={(e) => {
                        setFormDetails({
                          ...formDetails,
                          category: "Meetup",
                        });
                      }}
                    >
                      Meetup
                    </MenuItem>
                    <MenuDivider color="gray.400" />
                    <MenuItem
                      onClick={(e) => {
                        setFormDetails({
                          ...formDetails,
                          category: "Party",
                        });
                      }}
                    >
                      Party
                    </MenuItem>
                  </MenuList>
                </Menu>
              </FormControl>
            </Flex>
            <Flex experimental_spaceX="8" mt="6">
              <FormControl
                opacity={isPaid ? 1 : 0.8}
                _disabled={{}}
                isDisabled={!isPaid}
                borderBottom="2px"
                borderBottomColor="gray.200"
                _focusWithin={{ borderBottomColor: "gray.300" }}
              >
                <FormLabel
                  fontSize={{ lg: "md", xl: "lg" }}
                  color="blackAlpha.700"
                  my="0"
                >
                  Ticket Amount
                </FormLabel>
                <InputGroup>
                  <Input
                    required={isPaid}
                    onChange={(e) => {
                      setFormDetails({
                        ...formDetails,
                        price: Number(e.target.value),
                      });
                    }}
                    type="number"
                    fontSize="sm"
                    px="0"
                    _placeholder={{ color: "gray.300" }}
                    placeholder="Price of one ticket"
                    bg="transparent"
                    border="none"
                    rounded="none"
                    _hover={{}}
                    _focus={{}}
                    _active={{}}
                  />
                  <InputRightElement>
                    <Flex
                      borderLeft="2px"
                      borderColor="gray.200"
                      experimental_spaceX="2"
                      align="center"
                      mr="20"
                      bg="white"
                      pl="2"
                    >
                      <Image
                        src="assets/matic_circle.svg"
                        alt="matic"
                        w="4"
                        h="4"
                      />
                      <Text
                        color="blackAlpha.700"
                        fontSize="sm"
                        letterSpacing={1}
                        fontWeight="medium"
                        fontFamily="heading"
                      >
                        MATIC
                      </Text>
                    </Flex>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl
                onClick={onOpen}
                borderBottom="2px"
                borderBottomColor="gray.200"
                _focusWithin={{ borderBottomColor: "gray.300" }}
              >
                <FormLabel
                  fontSize={{ lg: "md", xl: "lg" }}
                  color="blackAlpha.700"
                  my="0"
                >
                  Date of Event
                </FormLabel>
                <InputGroup>
                  <Input
                    _placeholder={{ color: "gray.300" }}
                    fontSize="sm"
                    required
                    cursor="pointer"
                    value={
                      formDetails.date.date === 0
                        ? ""
                        : `${formDetails.date.date}/${
                            formDetails.date.month + 1
                          }/${formDetails.date.year}`
                    }
                    px="0"
                    placeholder="When will the event take place?"
                    bg="transparent"
                    border="none"
                    rounded="none"
                    _hover={{}}
                    _focus={{}}
                    _active={{}}
                  />
                  <InputRightElement color="gray.400">
                    <CalendarToday />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Flex>
          </Box>
          <Box h="auto" w="2px" my="20" bg="gray.100" />
          <Box>
            <Flex justify="center" mb="4">
              <Text
                style={{
                  background:
                    "-webkit-linear-gradient(360deg, #95E1FF 0%, #E7B0FF 51.58%, #FFD27B 111.28%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                textAlign="center"
                fontWeight="semibold"
                fontSize="2xl"
              >
                Live Preview
              </Text>
              <Image
                w={{ base: "4", lg: "4" }}
                ml="1"
                mt="-6"
                src="assets/elements/sparkle_gradient.svg"
                alt="element"
              />
            </Flex>
            <Box minW={{ base: "320px", xl: "360px" }}>
              <EventCard
                previewOnly
                event={{
                  title: formDetails.title || "Untitled",
                  description: "Event description goes here",
                  image: "assets/gradient.png",
                  date:
                    formDetails.date.date === 0
                      ? { date: 1, month: 0, year: 1 }
                      : formDetails.date,
                  owner: "Saptarshi",
                  slides: [],
                  type: formDetails.type || "type",
                  category: formDetails.category || "category",
                  buyers: [],
                  hosts: [],
                  price: formDetails.price,
                  tickets_available: 40,
                  tickets_sold: 13,
                }}
              />
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
            onClick={() => {
              if (
                formDetails.title &&
                formDetails.category &&
                (formDetails.price || !isPaid) &&
                formDetails.type &&
                formDetails.date.date !== 0
              ) {
                setSubmitting(true);
              }
            }}
            px="8"
          >
            Next Step
          </Button>
        </Box>
      </Box>
    </form>
  );
}

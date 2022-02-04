import {
  AspectRatio,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
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
import { CalendarToday, ChevronRight } from "@mui/icons-material";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { FaChevronDown, FaYoutube } from "react-icons/fa";
import EventCard from "../../components/Card/EventCard.component";
import { events } from "../../utils/testData";
import DateModal from "./DateModal.layout";
import Dropzone from "react-dropzone";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function Step3({
  event,
  onSubmit,
}: {
  onSubmit: Function;
  event: any;
}) {
  const [formDetails, setFormDetails] = useState({
    slides: [],
    image: "",
    video: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formDetails);
      }}
    >
      <Box color="brand.black">
        <Text
          align="center"
          color="brand.black400"
          fontSize="4xl"
          fontWeight="semibold"
        >
          Add image/video to your event
        </Text>

        <Flex
          justify="space-between"
          experimental_spaceX={{ base: "12", xl: "16" }}
          mt="6"
          px="10"
          maxW="1400px"
          mx="auto"
        >
          <Box fontFamily="body" w="full">
            <FormControl>
              <FormLabel
                fontSize={{ base: "md", xl: "lg" }}
                color="blackAlpha.700"
                my="0"
              >
                Cover Image
              </FormLabel>
              <FormLabel
                fontSize={{ base: "xs", xl: "sm" }}
                color="blackAlpha.500"
                my="0"
                mt="1"
                pb="4"
              >
                Add an image for the cover of your event’s card
              </FormLabel>
              <AspectRatio ratio={16 / 8} maxW="440px">
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    console.log(acceptedFiles);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Flex
                      {...getRootProps()}
                      w="full"
                      border="2px"
                      borderColor="gray.300"
                      borderStyle="dashed"
                      rounded="xl"
                      _hover={{ borderColor: "blue.300" }}
                      _focus={{ borderColor: "blue.300" }}
                      experimental_spaceY="4"
                      direction="column"
                      align="center"
                      justify="center"
                      pb="2"
                    >
                      <input
                        {...getInputProps()}
                        style={{ display: "none" }}
                        accept="image/*"
                      />
                      <Image
                        src="/assets/elements/images.svg"
                        alt="images"
                        w="8"
                      />
                      <Button
                        _hover={{ bg: "blackAlpha.50" }}
                        _focus={{}}
                        _active={{}}
                        border="2px"
                        bg="transparent"
                        fontSize="xx-small"
                        fontWeight="medium"
                        size="xs"
                        py="3"
                        rounded="md"
                        borderColor="blackAlpha.200"
                        color="blackAlpha.400"
                      >
                        Select images
                      </Button>
                      <Text color="blackAlpha.400" fontSize="xx-small">
                        (Recommended size: 420x187 | JPG, PNG | Max size: 2MB)
                      </Text>
                    </Flex>
                  )}
                </Dropzone>
              </AspectRatio>
            </FormControl>

            <FormControl
              mt="8"
              _focusWithin={{ borderBottomColor: "gray.300" }}
            >
              <FormLabel
                fontSize={{ base: "md", xl: "lg" }}
                color="blackAlpha.700"
                my="0"
              >
                Youtube Video (Optional)
              </FormLabel>
              <FormLabel
                fontSize={{ base: "xs", xl: "sm" }}
                color="blackAlpha.500"
                my="0"
                mt="1"
                pb="4"
              >
                Add a video about your event. If added, it’ll appear as the
                first item in the gallery
              </FormLabel>
              <InputGroup>
                <Input
                  _focus={{
                    ring: "1px",
                    ringColor: "blue.300",
                    borderColor: "blue.300",
                  }}
                  maxW="500px"
                  onChange={(e) => {
                    setFormDetails({ ...formDetails, video: e.target.value });
                  }}
                  fontSize="sm"
                  value={formDetails.video}
                  borderColor="gray.300"
                  placeholder="Link to video"
                  bg="transparent"
                  rounded="full"
                  _hover={{}}
                  _active={{}}
                />
                <InputLeftElement ml="1" color="gray.400">
                  <FaYoutube size="20px" />
                </InputLeftElement>
              </InputGroup>
            </FormControl>
          </Box>

          <Box minW={{ base: "520px", xl: "700px" }}>
            <FormControl _focusWithin={{ borderBottomColor: "gray.300" }}>
              <FormLabel
                fontSize={{ base: "md", xl: "lg" }}
                color="blackAlpha.700"
                my="0"
              >
                Gallery
              </FormLabel>
              <FormLabel
                fontSize={{ base: "xs", xl: "sm" }}
                color="blackAlpha.500"
                my="0"
                mt="1"
                pb="4"
              >
                Add atleast 3 images to help explain your event
              </FormLabel>
              <Flex alignItems="end" experimental_spaceX="4" w="full">
                <AspectRatio
                  ratio={16 / 9}
                  w="full"
                  rounded="lg"
                  overflow="hidden"
                >
                  <Dropzone
                    onDrop={(acceptedFiles) => console.log(acceptedFiles)}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Flex
                        {...getRootProps()}
                        direction="column"
                        align="center"
                        justify="center"
                        experimental_spaceY="4"
                        border="2px"
                        borderColor="gray.300"
                        borderStyle="dashed"
                        rounded="xl"
                        _hover={{ borderColor: "blue.300" }}
                        _focus={{ borderColor: "blue.300" }}
                        pb="2"
                      >
                        <input
                          {...getInputProps()}
                          style={{ display: "none" }}
                          accept="image/*"
                        />
                        <Image src="/assets/elements/images.svg" alt="images" />
                        <Button
                          _hover={{ bg: "blackAlpha.50" }}
                          _focus={{}}
                          _active={{}}
                          border="2px"
                          bg="transparent"
                          fontSize="sm"
                          fontWeight="medium"
                          size="sm"
                          py="4"
                          borderColor="blackAlpha.200"
                          color="blackAlpha.300"
                        >
                          Select images
                        </Button>
                        <Text color="blackAlpha.300" fontSize="xs">
                          (Recommended size: 420x187 | JPG, PNG | Max size: 2MB)
                        </Text>
                      </Flex>
                    )}
                  </Dropzone>
                </AspectRatio>
                <Box
                  maxH={{ base: "210px", xl: "320px" }}
                  minW={{ md: "100px", lg: "110px", xl: "120px" }}
                  overflowY="auto"
                >
                  <Flex
                    px="1"
                    py="1"
                    direction="column"
                    minW={{ md: "90px", lg: "100px", xl: "110px" }}
                    experimental_spaceY="2"
                  >
                    {[1, 2, 3, 4, 5].map((data, key) => (
                      <AspectRatio
                        key={key}
                        cursor="pointer"
                        transitionDuration="100ms"
                        ratio={16 / 9}
                        border="2px"
                        borderColor="gray.300"
                        borderStyle="dashed"
                        _hover={{ borderColor: "blue.300" }}
                        _focus={{ borderColor: "blue.300" }}
                        w="full"
                        ringColor="brand.peach"
                        rounded="md"
                        overflow="hidden"
                      >
                        <Dropzone
                          onDrop={(acceptedFiles) => console.log(acceptedFiles)}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <Box {...getRootProps()}>
                              <input
                                {...getInputProps()}
                                style={{ display: "none" }}
                                accept="image/*"
                              />
                            </Box>
                          )}
                        </Dropzone>
                      </AspectRatio>
                    ))}
                  </Flex>
                </Box>
              </Flex>
            </FormControl>
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
            Next Step
          </Button>
        </Box>
      </Box>
    </form>
  );
}

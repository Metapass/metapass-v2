import {
  Modal,
  ModalOverlay,
  Text,
  ModalContent,
  ModalHeader,
  Flex,
  ModalCloseButton,
  ModalBody,
  Select,
  Divider,
  ModalFooter,
  Box,
  Button,
} from "@chakra-ui/react";
import { CalendarToday } from "@mui/icons-material";
import { useState } from "react";

export default function DateModal({ isOpen, onClose, onSubmit }: any) {
  const [date, setDate] = useState({
    date: 0,
    month: 0,
    year: 0,
  });

  function range(start: number, end: number) {
    return Array(end - start + 1)
      .fill(1)
      .map((_, idx) => start + idx);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent color="brand.black" overflow="hidden" rounded="xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(date);
            onClose();
          }}
        >
          <ModalHeader fontWeight="medium" fontSize="lg">
            <Flex align="center" experimental_spaceX="2">
              <CalendarToday fontSize="small" />
              <Text>Date of Event</Text>
            </Flex>
            <ModalCloseButton _focus={{}} />
          </ModalHeader>
          <ModalBody>
            <Flex experimental_spaceX="2">
              <Select
                placeholder="Day"
                required
                onChange={(e) => {
                  setDate({
                    ...date,
                    date: Number(e.target.value),
                  });
                }}
              >
                {range(1, 31).map((data, key) => (
                  <option key={key} value={data}>
                    {data}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Month"
                minW="160px"
                required
                onChange={(e) => {
                  setDate({
                    ...date,
                    month: Number(e.target.value),
                  });
                }}
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((data, key) => (
                  <option key={key} value={key}>
                    {data}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Year"
                required
                onChange={(e) => {
                  setDate({
                    ...date,
                    year: Number(e.target.value),
                  });
                }}
              >
                {range(
                  new Date().getFullYear(),
                  new Date().getFullYear() + 10
                ).map((data, key) => (
                  <option key={key} value={data}>
                    {data}
                  </option>
                ))}
              </Select>
            </Flex>
          </ModalBody>
          <Divider mt="2" />
          <ModalFooter bg="blackAlpha.50">
            <Box
              p="1.5px"
              transitionDuration="200ms"
              rounded="full"
              boxShadow="0px 5px 33px rgba(0, 0, 0, 0.08)"
              bg="brand.gradient"
              _hover={{ transform: "scale(1.05)" }}
              _focus={{}}
              _active={{ transform: "scale(0.95)" }}
            >
              <Button
                type="submit"
                rounded="full"
                bg="white"
                size="sm"
                color="blackAlpha.700"
                fontWeight="medium"
                _hover={{}}
                _focus={{}}
                _active={{}}
                role="group"
              >
                Done
              </Button>
            </Box>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuIcon,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  Apps,
  AttachMoney,
  LocalOffer,
  Search,
  Tag,
} from "@mui/icons-material";

export default function SearchBar() {
  return (
    <Flex
      borderBottom="2px"
      borderLeft="2px"
      borderRight="none"
      borderTop="none"
      borderColor="blackAlpha.100"
      boxShadow="0px 18px 91px rgba(0, 0, 0, 0.07)"
      bg="white"
      rounded="full"
      alignItems="center"
      pl="6"
      fontSize="lg"
      w="full"
      justify="space-between"
    >
      <Flex w="full" alignItems="center">
        <InputGroup>
          <Input
            bg="transparent"
            border="none"
            _focus={{}}
            _hover={{}}
            rounded="none"
            placeholder="Search events by name or type ..."
          />
        </InputGroup>

        <Box minW="2.5px" bg="gray.100" h="12" />
        <Menu>
          <MenuButton w="full" maxW={{ lg: "160px", xl: "180px" }}>
            <InputGroup>
              <InputLeftElement color="gray.400">
                <Tag />
              </InputLeftElement>
              <Input
                bg="transparent"
                border="none"
                _focus={{}}
                _hover={{}}
                rounded="none"
                placeholder="Event type"
              />
            </InputGroup>
          </MenuButton>
          <MenuList rounded="lg" shadow="none" fontSize="sm" mt="3">
            <MenuItem>Online</MenuItem>
            <MenuDivider color="gray.400" />
            <MenuItem>In-person</MenuItem>
          </MenuList>
        </Menu>
        <Box minW="2.5px" bg="gray.100" h="12" />
        <Menu>
          <MenuButton w="full" maxW={{ lg: "120px", xl: "130px" }}>
            <InputGroup>
              <InputLeftElement color="gray.400">
                <AttachMoney />
              </InputLeftElement>
              <Input
                bg="transparent"
                border="none"
                _focus={{}}
                _hover={{}}
                rounded="none"
                placeholder="Price"
              />
            </InputGroup>
          </MenuButton>
          <MenuList rounded="lg" shadow="none" fontSize="sm" mt="3">
            <MenuItem>Paid</MenuItem>
            <MenuDivider color="gray.400" />
            <MenuItem>Free</MenuItem>
          </MenuList>
        </Menu>
        <Box minW="2.5px" bg="gray.100" h="12" />
        <Menu>
          <MenuButton w="full" maxW={{ lg: "150px", xl: "180px" }}>
            <InputGroup>
              <InputLeftElement color="gray.400">
                <Apps />
              </InputLeftElement>
              <Input
                bg="transparent"
                border="none"
                _focus={{}}
                _hover={{}}
                rounded="none"
                placeholder="Category"
              />
            </InputGroup>
          </MenuButton>
          <MenuList rounded="lg" shadow="none" fontSize="sm" mt="3">
            <MenuItem>Meetup</MenuItem>
            <MenuDivider color="gray.400" />
            <MenuItem>Party</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Button
        role="group"
        leftIcon={
          <Flex
            justify="center"
            alignItems="center"
            _groupHover={{ transform: "scale(1.1)" }}
            transitionDuration="200ms"
          >
            {" "}
            <Search />
          </Flex>
        }
        _hover={{}}
        _focus={{}}
        _active={{}}
        rounded="full"
        color="white"
        bg="brand.gradient"
        roundedBottomLeft="none"
        py="8"
        px="8"
        fontSize="lg"
      >
        Search
      </Button>
    </Flex>
  );
}

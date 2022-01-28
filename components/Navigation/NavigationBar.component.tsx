import { Button, Flex, Image, Text, Link, Box } from "@chakra-ui/react";
import { AccountBalanceWallet, Add } from "@mui/icons-material";
import NextLink from "next/link";

export default function NavigationBar() {
  return (
    <Flex
      justify="space-between"
      px="8"
      position="relative"
      zIndex={2}
      maxW="1600px"
      mx="auto"
      py="6"
      alignItems="center"
      color="white"
    >
      <NextLink href="/" passHref>
        <Link _hover={{}} _focus={{}} _active={{}}>
          <Image src="assets/logo.svg" alt="Metapass" w="10" />
        </Link>
      </NextLink>
      <Flex alignItems="center" experimental_spaceX="6">
        <Button
          pl="1"
          rounded="full"
          bg="whiteAlpha.800"
          color="blackAlpha.700"
          fontWeight="medium"
          _hover={{ shadow: "sm", bg: "white" }}
          border="2px"
          borderColor="white"
          _focus={{}}
          _active={{ transform: "scale(0.95)" }}
          role="group"
          leftIcon={
            <Flex
              _groupHover={{ transform: "scale(1.05)" }}
              transitionDuration="200ms"
              justify="center"
              alignItems="center"
              color="white"
              bg="brand.gradient"
              rounded="full"
              p="0.5"
            >
              <Add />
            </Flex>
          }
        >
          Create Event
        </Button>

        <Button
          rounded="full"
          color="white"
          bg="blackAlpha.500"
          border="2px"
          _hover={{ bg: "blackAlpha.600" }}
          _focus={{}}
          _active={{ bg: "blackAlpha.700" }}
          py="5"
          fontWeight="normal"
          leftIcon={<AccountBalanceWallet />}
        >
          Connect Wallet
        </Button>
      </Flex>
    </Flex>
  );
}

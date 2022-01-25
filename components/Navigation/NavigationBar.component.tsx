import { Button, Flex, Image, Text, Link } from "@chakra-ui/react";
import { AccountBalanceWallet } from "@mui/icons-material";

export default function NavigationBar() {
  return (
    <Flex
      justify="space-between"
      px="10"
      position="relative"
      zIndex={2}
      maxW="1600px"
      mx="auto"
      py="6"
      alignItems="center"
      color="white"
    >
      <Image src="assets/logo.svg" alt="Metapass" w="10" />
      <Flex alignItems="center" experimental_spaceX="6">
        <Link _hover={{ bg: "" }}>About</Link>
        <Link _hover={{ bg: "" }}>How it works</Link>
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

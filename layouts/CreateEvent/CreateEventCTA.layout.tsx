import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { Check } from "@mui/icons-material";
import { FaCheck } from "react-icons/fa";
import SearchBar from "../../components/Elements/SearchBar.component";
import NavigationBar from "../../components/Navigation/NavigationBar.component";

export default function CreateEventCTA({ step = 0, setStep }: any) {
  return (
    <>
      <Box
        backgroundImage={`url("assets/gradient.png")`}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        position="relative"
        overflow="hidden"
      >
        <video
          autoPlay
          muted
          loop
          id="myVideo"
          style={{
            position: "absolute",
            top: 0,
            zIndex: 0,
            minWidth: "100%",
          }}
        >
          <source src="/assets/gradient.mp4" type="video/mp4" />
        </video>
        <NavigationBar />
        <Box
          textAlign="center"
          color="white"
          pb="10"
          mt="6"
          mb="6"
          zIndex={2}
          position="relative"
        >
          <Flex justify="center" ml="12">
            <Text
              textAlign="center"
              fontFamily="azonix"
              fontSize={{ base: "4xl", lg: "4xl", xl: "5xl" }}
            >
              CREATE EVENT
            </Text>
            <Image
              w={{ base: "6", lg: "8" }}
              ml="1"
              mt="-16"
              src="assets/elements/sparkle.svg"
              alt="element"
            />
          </Flex>
        </Box>
      </Box>
      <Flex justify="center" w="full" position="relative" zIndex={99}>
        <Box
          w="fit-content"
          bg="white"
          rounded="full"
          transform="translateY(-28px)"
          boxShadow="0px 18px 91px rgba(0, 0, 0, 0.07)"
          border="1px"
          borderColor="blackAlpha.200"
          p="2"
        >
          <Flex experimental_spaceX="4">
            {[1, 2, 3, 4, 5].map((data, key) => (
              <Flex
                w="10"
                h="10"
                key={key}
                onClick={() => {
                  if (step > data - 1) {
                    setStep(key);
                  }
                }}
                bg={
                  step === data - 1
                    ? "brand.purple"
                    : step > data - 1
                    ? "brand.green"
                    : "white"
                }
                rounded="full"
                justify="center"
                align="center"
                border="2px"
                fontSize="xl"
                fontWeight="medium"
                borderColor="blackAlpha.300"
                color={step >= data - 1 ? "white" : "blackAlpha.300"}
              >
                {step > data - 1 ? <Check /> : `${data}`}
              </Flex>
            ))}
          </Flex>
        </Box>
      </Flex>
    </>
  );
}

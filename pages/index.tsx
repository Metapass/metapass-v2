import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import FeaturedEvents from "../layouts/FeaturedEvents/FeaturedEvents";
import HeroCTA from "../layouts/HeroCTA/HeroCTA.layout";

const Home: NextPage = () => {
  return (
    <Box minH="100vh" h="full" overflow="hidden">
      <HeroCTA />
      <Box p="2" />
      <FeaturedEvents />
    </Box>
  );
};

export default Home;

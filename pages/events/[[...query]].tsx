import {
  Box,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import SearchBar from "../../components/Elements/SearchBar.component";
import ExploreCTA from "../../layouts/Explore/ExploreCTA.layout";
import FeaturedEvents from "../../layouts/Explore/FeaturedEvents.layout";
import QueriedEvents from "../../layouts/Explore/QueriedEvents.layout";
import { AnimatePresence, motion } from "framer-motion";
import PageLayout from "../../components/Wrappers/PageLayout.component";
import { useRouter } from "next/router";
import EventLayout from "../../layouts/Event/Event.layout";
import { events } from "../../utils/testData";

const Explore: NextPage = () => {
  const [isScrolling, setScrolling] = useState(true);
  const router = useRouter();
  const { query } = router.query;
  const [showEventModal, setEventModal] = useState<boolean>(
    query ? (query[0] ? true : false) : false
  );

  useEffect(() => {
    setEventModal(query ? (query[0] ? true : false) : false);
  }, [query]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 240) {
        setScrolling(false);
      } else {
        setScrolling(true);
      }
    });
  }, []);
  return (
    <PageLayout>
      {showEventModal && (
        <Modal
          isCentered
          size="5xl"
          isOpen={showEventModal}
          onClose={() => {
            setEventModal(false);
          }}
        >
          <ModalOverlay />

          <ModalContent rounded={{ base: "none", lg: "xl" }}>
            <ModalCloseButton
              bg="white"
              _focus={{}}
              _active={{}}
              roundedRight="full"
              zIndex={9999}
              _hover={{ color: "brand.peach" }}
              top="2"
              right="-6"
            />
            <ModalBody>
              <EventLayout event={events[0]} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      <Head>
        <title>MetaPass | Explore</title>
      </Head>
      <Box minH="100vh" h="full" overflowX="hidden">
        <AnimatePresence>
          {!isScrolling && (
            <motion.div
              initial={{ opacity: 0, y: -200 }}
              transition={{ duration: 0.4 }}
              animate={{ opacity: [0, 1], y: [-200, 0] }}
              exit={{ y: [0, -200] }}
              style={{
                width: "100%",
                position: "fixed",
                zIndex: 999,
                boxShadow: "0px 18px 91px rgba(0, 0, 0, 0.07)",
              }}
            >
              <Box
                w="full"
                bg="black"
                backgroundImage={`url("/assets/gradient.png")`}
                backgroundSize="cover"
                backgroundRepeat="no-repeat"
              >
                <Flex
                  w="full"
                  px={{ md: "20" }}
                  justify="center"
                  transform="translateY(35px)"
                >
                  <SearchBar noEffects />
                </Flex>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
        <ExploreCTA />
        <FeaturedEvents />
        <Box mx="auto" pb="10" pt="3" maxW="400px">
          <Divider filter="brightness(95%)" />
        </Box>
        <Flex justify="center" pb="20">
          <QueriedEvents />
        </Flex>
      </Box>
    </PageLayout>
  );
};

export default Explore;

import { Box, Divider, Flex } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { SetStateAction, useEffect, useState } from "react";
import SearchBar from "../../components/Elements/SearchBar.component";
import ExploreCTA from "../../layouts/Explore/ExploreCTA.layout";
import FeaturedEvents from "../../layouts/Explore/FeaturedEvents.layout";
import QueriedEvents from "../../layouts/Explore/QueriedEvents.layout";
import { AnimatePresence, motion } from "framer-motion";
import CreateEventCTA from "../../layouts/CreateEvent/CreateEventCTA.layout";
import Step1 from "../../layouts/CreateEvent/Step1.layout";
import Step2 from "../../layouts/CreateEvent/Step2.layout";

const Create: NextPage = () => {
  const [step, setStep] = useState(0);
  const [event, setEvent] = useState({});

  return (
    <>
      <Head>
        <title>MetaPass | Create Event</title>
      </Head>
      <Box minH="100vh" h="full" overflowX="hidden">
        <CreateEventCTA step={step} setStep={setStep} />
        <Box mt="4">
          <Box display={step === 0 ? "block" : "none"}>
            <Step1
              onSubmit={(formDetails: any) => {
                setEvent({
                  ...event,
                  ...formDetails,
                });
                console.log(formDetails);
                setStep(1);
              }}
            />
          </Box>
          <Box display={step === 1 ? "block" : "none"}>
            <Step2
              event={event}
              onSubmit={(formDetails: any) => {
                setEvent({
                  ...event,
                  ...formDetails,
                });
                console.log(formDetails);
                setStep(2);
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Create;

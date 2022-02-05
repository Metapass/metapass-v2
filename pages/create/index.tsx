import { Box, Divider, Flex } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { SetStateAction, useContext, useEffect, useState } from "react";
import SearchBar from "../../components/Elements/SearchBar.component";
import ExploreCTA from "../../layouts/Explore/ExploreCTA.layout";
import FeaturedEvents from "../../layouts/Explore/FeaturedEvents.layout";
import QueriedEvents from "../../layouts/Explore/QueriedEvents.layout";
import { AnimatePresence, motion } from "framer-motion";
import CreateEventCTA from "../../layouts/CreateEvent/CreateEventCTA.layout";
import Step1 from "../../layouts/CreateEvent/Step1.layout";
import Step2 from "../../layouts/CreateEvent/Step2.layout";
import Step3 from "../../layouts/CreateEvent/Step3.layout";
import Step4 from "../../layouts/CreateEvent/Step4.layout";
import Step5 from "../../layouts/CreateEvent/Step5.layout";
import { walletContext } from "../../utils/walletContext";

const Create: NextPage = () => {
  const [wallet, setWallet] = useContext(walletContext);
  const [step, setStep] = useState(0);
  const [event, setEvent] = useState({
    owner: wallet.address,
    buyers: [],
  });

  useEffect(() => {
    console.log(event);
  }, [event]);

  useEffect(() => {
    setEvent({
      ...event,
      owner: wallet.address,
    });
  }, [wallet]);

  function onSubmit() {
    console.log(event);
  }

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

                setStep(2);
              }}
            />
          </Box>
          <Box display={step === 2 ? "block" : "none"}>
            <Step3
              event={event}
              onSubmit={(formDetails: any) => {
                setEvent({
                  ...event,
                  ...formDetails,
                });

                setStep(3);
              }}
            />
          </Box>
          <Box display={step === 3 ? "block" : "none"}>
            <Step4
              event={event}
              onSubmit={() => {
                setStep(4);
              }}
            />
          </Box>
          <Box display={step === 4 ? "block" : "none"}>
            <Step5
              event={event}
              onSubmit={() => {
                onSubmit();
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Create;

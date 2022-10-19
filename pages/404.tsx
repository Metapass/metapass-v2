import React, { useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';

function NotFound() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 3000);
  });
  return (
    <Box p={10}>
      <Flex justifyContent='center' alignItems={'center'} direction='column'>
        Sorry buddy, the requested URL wasn't found :(
        <span>Redirecting you to homepage</span>{' '}
      </Flex>
    </Box>
  );
}

export default NotFound;

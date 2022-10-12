import { Box, Flex, Skeleton } from '@chakra-ui/react';

const EventsLoading = () => {
  return (
    <Box
      my='5px'
      maxW={{ base: '330px', xl: '390px' }}
      h='full'
      flex='1'
      marginLeft='30px'
      minW={{ base: '330px', xl: '390px' }}
      borderRadius='xl'
    >
      <Skeleton
        maxW={{
          base: '330px',
          xl: '390px',
        }}
        minW={{
          base: '330px',
          xl: '390px',
        }}
        isLoaded={false}
        borderRadius='md'
      >
        <Flex
          direction='column'
          rounded='lg'
          overflow='hidden'
          bg='white'
          _hover={{
            transform: 'scale(1.01)',
          }}
          _active={{
            transform: 'scale(1.03)',
          }}
          transitionDuration='200ms'
          cursor='pointer'
          boxShadow='0px -4px 52px rgba(0, 0, 0, 0.11)'
          w='full'
          border='1px'
          position='relative'
          h='15rem'
          borderRadius='30px'
          borderColor='blackAlpha.200'
        ></Flex>
      </Skeleton>
    </Box>
  );
};
export default EventsLoading;

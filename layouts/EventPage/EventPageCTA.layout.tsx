import { Box } from '@chakra-ui/react';
import NavigationBar from '../../components/Navigation/NavigationBar.component';

export default function EventPageCTA() {
  return (
    <>
      <Box
        backgroundSize='cover'
        backgroundRepeat='no-repeat'
        position='relative'
      >
        <NavigationBar mode='white' />
      </Box>
    </>
  );
}

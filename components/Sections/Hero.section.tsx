import type { NextComponentType } from 'next';

import NavigationBar from '../Navigation/NavigationBar.component';
import { Box } from '@chakra-ui/react';

const HeroSection: NextComponentType = () => {
  return (
    <Box h='64' bgGradient='linear(to-r, #12c2e9, #c471ed, #f64f59)'>
      <NavigationBar />
    </Box>
  );
};

export default HeroSection;

import { Flex, Image, Spinner, Box, Skeleton } from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';

export default function LazyImage({ ...otherProps }) {
  const [loading, setLoading] = useState(true);
  const imgRef = React.createRef<HTMLImageElement>();
  const skeletonRef = React.createRef<HTMLDivElement>();
  return (
    <Image
      loading='lazy'
      w='full'
      {...otherProps}
      alt={otherProps?.alt}
      onLoad={() => {
        setLoading(false);
      }}
    />
  );
}

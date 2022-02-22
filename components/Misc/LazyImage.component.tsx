import { Flex, Image, Spinner, Box, Skeleton } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'

export default function LazyImage({ ...otherProps }) {
    const [loading, setLoading] = useState(true)
    const imgRef = React.createRef<HTMLImageElement>()
    const skeletonRef = React.createRef<HTMLDivElement>()
    return (
        <Box w="full" rounded={otherProps?.rounded}>
            <Skeleton w="full" h="full" ref={skeletonRef}></Skeleton>

            <Image
                w="full"
                h="full"
                ref={imgRef}
                display="none"
                {...otherProps}
                alt={otherProps?.alt}
                onLoad={() => {
                    const el: any = imgRef.current
                    el.style.display = 'block'
                    const el2: any = skeletonRef.current
                    el2.style.display = 'none'
                }}
            />
        </Box>
    )
}

import { Box, Flex, Text, Image } from '@chakra-ui/react'
// import { FaCh } from "@mui/icons-material";
import { FaCheck } from 'react-icons/fa'
import SearchBar from '../../components/Elements/SearchBar.component'
import NavigationBar from '../../components/Navigation/NavigationBar.component'

export default function EventPageCTA() {
    return (
        <>
            <Box
                backgroundSize="cover"
                backgroundRepeat="no-repeat"
                position="relative"
            >
                <NavigationBar mode="white" />
            </Box>
        </>
    )
}

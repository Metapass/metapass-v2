import { Flex, Box, Button, Badge } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/config/supabaseConfig'
import { getAllRoles } from '../../utils/helpers/api/getAllRoles'

const RoleChooser = ({ guild }: { guild: string }) => {
    const [roles, setRoles] = useState<any[]>([])
    console.log(roles)
    const session = supabase.auth.session()

    useEffect(() => {
        const fetchRoles = async () => {
            if (guild) {
                const roles = await getAllRoles(guild, session?.access_token!)

                setRoles(roles.roles)
            }
        }

        fetchRoles()
    }, [guild, session])

    return (
        <Flex gap="4">
            <Box rounded="lg" bg="brand.gradient" p="1.8px">
                <Box
                    py="3"
                    w="md"
                    bg="white"
                    rounded="lg"
                    display="grid"
                    gridTemplateColumns="repeat(3, 1fr)"
                    columnGap="4"
                    rowGap="4"
                    p="4"
                    alignItems="center"
                    flexWrap="wrap"
                >
                    {roles.map((role) => (
                        <Box
                            key={role.id}
                            bg="purple.400"
                            rounded="lg"
                            h="6"
                            display="grid"
                            placeItems="center"
                            px="2"
                            color="white"
                            fontSize="sm"
                        >
                            {role.name}
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box w="full" rounded="lg" bg="brand.gradient" p="1.8px">
                <Box h="full" bg="white" rounded="lg" w="md"></Box>
            </Box>
        </Flex>
    )
}

export default RoleChooser

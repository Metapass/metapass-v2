import { Flex, Box, Button, Badge, Select } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/config/supabaseConfig'
import { getAllRoles } from '../../utils/helpers/api/getAllRoles'
import { Reorder } from 'framer-motion'
import toast from 'react-hot-toast'
import { IRole } from '../../types/discordEveent.types'
import { useRecoilState } from 'recoil'
import { discordEventDataAtom } from '../../lib/recoil/atoms'

const RoleChooser = ({ guild }: any) => {
    const [roles, setRoles] = useState<IRole[]>([])
    const session = supabase.auth.session()
    const [role, setRole] = useState<string>()
    const [discordEventData, setDiscordEventData] =
        useRecoilState(discordEventDataAtom)

    useEffect(() => {
        const fetchRoles = async () => {
            if (guild) {
                const roles = await getAllRoles(guild, session?.access_token!)

                setRoles(roles.roles)
            }
        }

        fetchRoles()
    }, [guild, session])

    const handleAddRole = (id: string) => {
        if (discordEventData.roles.find((r: any) => r.id === id)) {
            toast.error('This role is already in the list')
            return
        } else {
            const role = roles.find((r: any) => r.id === id)
            setDiscordEventData({
                ...discordEventData,
                roles: [
                    ...discordEventData.roles,
                    {
                        id: role?.id!,
                        name: role?.name!,
                    },
                ],
            })

            toast.success('Role added')
        }
    }

    const handleDel = (id: string) => {
        setDiscordEventData({
            ...discordEventData,
            roles: discordEventData.roles.filter((r: any) => r.id !== id),
        })

        toast.success('Role removed')
    }

    return (
        <Flex gap="4" direction="column">
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
                border="2px solid #E7B0FF"
            >
                {discordEventData.roles.map((role: IRole) => (
                    <Box
                        key={role.id}
                        bg="purple.400"
                        rounded="full"
                        h="8"
                        display="grid"
                        placeItems="center"
                        // px="2"
                        color="white"
                        fontSize="15px"
                        cursor="pointer"
                        role="group"
                    >
                        <Flex
                            display="none"
                            w="full"
                            h="8"
                            rounded="full"
                            bg="red.400"
                            color="white"
                            alignItems="center"
                            justifyContent="center"
                            _groupHover={{
                                display: 'flex',
                            }}
                            transition="all 0.4s"
                            onClick={() => handleDel(role.id)}
                        >
                            Delete
                        </Flex>
                        {role.name}
                    </Box>
                ))}
            </Box>

            <Flex gap="4">
                <Select
                    placeholder="Select a role"
                    onChange={(e) => {
                        setRole(e.target.value as any)
                    }}
                    isDisabled={!guild || !roles.length}
                >
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </Select>

                <Button
                    bg="brand.gradient"
                    color="white"
                    rounded="full"
                    px="8"
                    _hover={{}}
                    fontWeight="500"
                    onClick={() => handleAddRole(role!)}
                    _active={{}}
                    _focus={{}}
                    isDisabled={!guild || !roles.length || !role}
                >
                    Add Role
                </Button>
            </Flex>
        </Flex>
    )
}

export default RoleChooser

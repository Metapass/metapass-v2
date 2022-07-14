import { Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react'
import { onAuthStateChanged, User, signOut } from 'firebase/auth'
import { FC, useState } from 'react'
import { auth } from '../../utils/firebaseUtils'
import { IoIosLogOut } from 'react-icons/io'

const UserMenu: FC = () => {
    const [user, setUser] = useState<User>()

    onAuthStateChanged(auth, (user) => {
        setUser(user as User)
    })

    return (
        <Menu>
            <MenuButton>
                <Avatar src={user?.photoURL!} size="md" />
            </MenuButton>
            <MenuList>
                <MenuItem
                    fontSize="sm"
                    icon={<IoIosLogOut size="20px" />}
                    color="red.500"
                    onClick={() => signOut(auth)}
                >
                    Logout
                </MenuItem>
            </MenuList>
        </Menu>
    )
}

export default UserMenu

import { atom } from 'recoil'

const stepAtom = atom<number>({
    key: 'stepAtom',
    default: 4,
})

const inviteOnlyAtom = atom<boolean>({
    key: 'inviteOnlyAtom',
    default: true,
})

export { stepAtom, inviteOnlyAtom }

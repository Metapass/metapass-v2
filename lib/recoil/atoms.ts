import { atom } from 'recoil'

const stepAtom = atom<number>({
    key: 'stepAtom',
    default: 0,
})

const inviteOnlyAtom = atom<boolean>({
    key: 'inviteOnlyAtom',
    default: false,
})

export { stepAtom, inviteOnlyAtom }

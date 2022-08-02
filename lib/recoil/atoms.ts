import { atom } from 'recoil'
import { formType } from '../../types/registerForm.types'
import { defaultFormData } from '../constants'

const stepAtom = atom<number>({
    key: 'stepAtom',
    default: 0,
})

const inviteOnlyAtom = atom<boolean>({
    key: 'inviteOnlyAtom',
    default: false,
})

const formDetails = atom<formType>({
    key: 'registerFormDetails',
    default: defaultFormData,
})

export { stepAtom, inviteOnlyAtom, formDetails }

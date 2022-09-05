import { atom } from 'recoil'
import { IDiscordEvent } from '../../types/discordEveent.types'
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
const dropDownForm = atom<any[]>({
    key: 'dropdownForm',
    default: [],
})

const updateOnce = atom<boolean>({
    key: 'updateOnce',
    default: false,
})

const discordBased = atom<boolean>({
    key: 'disordBased',
    default: false,
})

const discordEventDataAtom = atom<IDiscordEvent>({
    key: 'discordEventData',
    default: {
        guild: '',
        roles: [],
    },
})

export {
    stepAtom,
    inviteOnlyAtom,
    formDetails,
    updateOnce,
    discordBased,
    discordEventDataAtom,
    dropDownForm
}

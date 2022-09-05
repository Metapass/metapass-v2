interface IRole {
    id: string
    name: string
}

interface IDiscordEvent {
    guild: string
    roles: IRole[]
}

interface IDiscordData {
    name?: string
    guild: string
    roles: any[]
}

export type { IRole, IDiscordEvent, IDiscordData }

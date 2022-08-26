interface IRole {
    id: string
    name: string
}

interface IDiscordEvent {
    guild: string
    roles: IRole[]
}

interface IDiscordData {
    guild: string
    roles: any[]
}

export type { IRole, IDiscordEvent, IDiscordData }

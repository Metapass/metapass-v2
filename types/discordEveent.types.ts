interface IRole {
    id: string
    name: string
}

interface IDiscordEvent {
    guild: string
    roles: IRole[]
}

export type { IRole, IDiscordEvent }

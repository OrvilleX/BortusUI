
export interface IEmailVoData {
    tos: string[]
    subject: string
    content: string
}

export interface IEmailConfigData {
    id: number
    host: string
    port: string
    user: string
    pass: string
    fromUser: string
}
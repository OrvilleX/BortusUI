
export interface EmailVoData {
    tos: string[]
    subject: string
    content: string
}

export interface EmailConfigData {
    id: number
    host: string
    port: string
    user: string
    pass: string
    fromUser: string
    sslEnable: string
}

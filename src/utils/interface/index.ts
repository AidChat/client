export interface UserProps{
    name ?: string,
    email ?: string,
    password ?: string,
    contact ?: string,
    extend ?: boolean
}

export enum SocketEmitters {
    _MESSAGE = "_MESSAGE",
    _DISCONNECT = '_DISCONNECT',
    _TYPING = '_TYPING'

}

export enum SocketListeners {
    MESSAGE = "MESSAGE",
    TYPING = "TYPING"
}
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
    _TYPING = '_TYPING',
    _JOIN = '_JOIN'

}

export enum SocketListeners {
    MESSAGE = "MESSAGE",
    TYPING = "TYPING"
}

export interface Role{
    id:number,
    type:"OWNER" | "ADMIN" | "MEMBER",
    userId: number,
    groupId:number
}
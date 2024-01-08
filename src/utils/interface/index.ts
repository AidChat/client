export interface UserProps{
    name ?: string,
    email ?: string,
    password ?: string,
    contact ?: string,
    extend ?: boolean,
    Type ?: 'Pending' | 'Seeker' | 'Helper'
}

export enum SocketEmitters {
    _MESSAGE = "_MESSAGE",
    _DISCONNECT = '_DISCONNECT',
    _TYPING = '_TYPING',
    _JOIN = '_JOIN',
    _READMESSAGE = '_READMESSAGE'

}

export enum SocketListeners {
    MESSAGE = "MESSAGE",
    TYPING = "TYPING",
    READBYALL = 'READBYALL',
    USERONLINE = 'USERONLINE',
    USEROFFLINE = 'USEROFFLINE'
}

export interface Role{
    id:number,
    type:"OWNER" | "ADMIN" | "MEMBER",
    userId: number,
    groupId:number
}


export interface UserProps {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    contact?: string;
    extend?: boolean;
    Type?: "Pending" | "Seeker" | "Helper";
    about?: string;
    mobile?: number;
    verifiedEmail ?: boolean
}

export enum SocketEmitters {
    _MESSAGE = "_MESSAGE",
    _DISCONNECT = "_DISCONNECT",
    _TYPING = "_TYPING",
    _JOIN = "_JOIN",
    _READMESSAGE = "_READMESSAGE",
}

export enum SocketListeners {
    MESSAGE = "MESSAGE",
    TYPING = "TYPING",
    READBYALL = "READBYALL",
    USERONLINE = "USERONLINE",
    USEROFFLINE = "USEROFFLINE",
}

export interface Role {
    id: number;
    type: "OWNER" | "ADMIN" | "MEMBER";
    userId: number;
    groupId: number;
}

export interface MessageInterface {
    MessageContent: MessageContent;
    created_at: string;
    groupId: number;
    id: number;
    messageContentId: number;
    senderId: number;
    status: string;
    User: {
        name: string; email: string; profileImage: string; id: number;
    };
    ReadByAll?: boolean;
    ReadReceipt:ReadReceipt[]
}

export interface ReadReceipt {
    id: number;
    userId: number;
    status: "Read" | "Sent";

}

export interface MessageContent {
    id: number;
    caption: null | string;
    content: string;
}

export interface IReminder {
    message?: string,
    title: string,
    id?: number
    notifyBefore: boolean,
    notifyApp: boolean,
    notifyWeb: boolean,
    self: boolean,
    recurring: boolean,
    when: string,
    recurringDays: string[],
    createdById ?:number,
    par ?:UserProps[],
    participants?:IReminderMembers
    createdBy ?:UserProps
}
export interface IReminderMembers{
    id:number,
    users:UserProps[]
    reminderId:number
}
import {EArticleStatus, IDBStore} from "../enum";

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
    verifiedEmail?: boolean,
    globalSocketID?:string,
    Username:string
}

export enum SocketEmitters {
    _MESSAGE = "_MESSAGE",
    _DISCONNECT = "_DISCONNECT",
    _TYPING = "_TYPING",
    _JOIN = "_JOIN",
    _READMESSAGE = "_READMESSAGE",
    _PING='PING',
    _ASK='ASK'
}

export enum SocketListeners {
    MESSAGE = "MESSAGE",
    TYPING = "TYPING",
    READBYALL = "READBYALL",
    USERONLINE = "USERONLINE",
    USEROFFLINE = "USEROFFLINE",
    RECORDUPDATE='RECORDUPDATE',
    REPLY='REPLY',
    PONG='PONG',
    NEWGROUP="activeGroup",
    JOINREQUEST="joiningRequest",
    PAYMENTDONE='paymentDone',
    CLIENTUPDATE='clientUpdate',
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
        name: string; email: string; profileImage: string; id: number,Username:string;
    };
    ReadByAll?: boolean;
    ReadReceipt: ReadReceipt[]
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
    TYPE: 'TEXT' | 'IMAGE'
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
    createdById?: number,
    par?: UserProps[],
    participants?: IReminderMembers
    createdBy?: UserProps
}

export interface IReminderMembers {
    id: number,
    users: UserProps[]
    reminderId: number
}

export type IDBStoreName  = 'BLOG'| 'AICHAT';

export interface Message {
    sender: 'User' | 'Model';
    message: string;
    created_at?: Date;
    id?:string | number;
}

export interface IBlogShortContent {
    id: number;
    content: string,
    created_at: Date,
    status:EArticleStatus
}

export interface IAnalysis{
    id:number,
    analysis:string,
    created_at:Date,
}
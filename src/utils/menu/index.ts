export const customMenuItems = [{
    id: 1, title: "View"
}, {
    id: 2, title: 'Update'
}, {
    id: 3, title: 'Delete'
}];


export const groupOptions: { id: number, label: string, icon: string, role: string[] }[] = [{
    id: 1, label: 'members', icon: 'BsPeople', role: []
}, {
    id: 1, label: 'invites', icon: 'AiOutlineUsergroupAdd', role: ['ADMIN', 'OWNER']
}, {
    id: 1, label: 'reminders', icon: 'BsAlarm', role: []
}, {
    id: 1, label: 'setting', icon: 'AiFillSetting', role: []
},

]
import QuillResizeImage from 'quill-resize-image';

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

export const QuillFormats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
    'size',
    'video',
    'align',
    'background',
    'direction',
    'code-block',
    'code',
];

export const QuillModules = {
    toolbar: [
        [{header: [1, 2,3,4,5, false]}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{list: 'ordered'}, {list: 'bullet'}],
        [{align: ''}, {align: 'center'}, {align: 'right'}, {align: 'justify'}],
        ['link', 'image','formula'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'color': [] }, { 'background': [] }]
    ],
    resize: {
        locale: {},
    },
};
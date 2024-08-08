import {useWindowSize} from "../../services/hooks";
import {EwindowSizes, IDBStore} from "../enum";
import {Device, DeviceId, DeviceInfo} from "@capacitor/device";
import {getToken} from "firebase/messaging";
import {PushNotifications} from "@capacitor/push-notifications";
import {getFCMMessaging} from "../../firebase.config";
import {ScreenOrientation} from "@capacitor/screen-orientation";
import {StatusBar} from "@capacitor/status-bar";
import {Dialog} from "@capacitor/dialog";
import {IDBStoreName, Message} from "../interface";
import {confirmDialog} from "primereact/confirmdialog";
import {Haptics, ImpactStyle} from "@capacitor/haptics";

export function formatTime(date: string) {
    return new Date(date).toTimeString().slice(0, 8);
}

export function validateEmail(email: string) {
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

export function formatTimeToHHMM(date: any) {
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const amOrPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert hours to 12-hour format

    const formattedTime = `${formattedHours}:${String(minutes).padStart(2, "0")} ${amOrPm}`;
    return formattedTime;
}

export const _debounce = (fn: () => void, timeout: number = 2000) => {
    let current;
    if (current) {
        clearTimeout(current);
    }
    current = window.setTimeout(function () {
        fn();
    }, timeout);
};

export function formatDateToDDMMYYYY(date: any) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const d1 = new Date();
    const day1 = String(d1.getDate()).padStart(2, "0");
    const month1 = String(d1.getMonth() + 1).padStart(2, "0");
    const year1 = d1.getFullYear();
    if (day + month + year === day1 + month1 + year1) {
        return "Today";
    } else {
        return `${day}/${month}/${year}`;
    }
}

export function useResponsizeClass(size: EwindowSizes, classArr: string[]): string {
    const {size: valid} = useWindowSize(size);
    let classes: string = "";
    if (valid) {
        handleClass();
    } else {
        return "";
    }

    function handleClass() {
        classArr.forEach(function (element, index) {
            classes += " " + element;
        });
        return classes;
    }

    return classes;
}

export async function getDeviceInfoUsingCapacitor() {
    const info: DeviceInfo = await Device.getInfo();
    return info
}

export async function getDeviceID() {
    let id = await Device.getId()
    return id
}

export async function getFCMToken() {
    return getToken(getFCMMessaging(), {
        vapidKey: process.env.REACT_APP_FIREBASEKEY,
    });
}

export async function requestForNotificationAccessIfNotGranted() {
    const deviceInfo: DeviceInfo = await getDeviceInfoUsingCapacitor();
    if (deviceInfo.platform === "web") {
        if (window.Notification && Notification.permission !== "granted") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Welcome to aidchat", {});
                }
            });
        }
    } else {
        PushNotifications.requestPermissions().then(function (result) {
            if (result.receive === "granted") {
                PushNotifications.register();
            }
        });
    }
}

export async function setScreenOrientation(type: 'portrait' | 'landscape') {
    await ScreenOrientation.lock({orientation: type});
}

export const hideStatusBar = async () => {
    await StatusBar.hide();
};


export const confirm = async ({message, header = 'Confirmation'}: {
    message: string,
    header?: string
}): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        getDeviceInfoUsingCapacitor().then(async (capacitor) => {
            if (capacitor.platform === 'web') {
                confirmDialog({
                    message,
                    header,
                    accept: function () {
                        resolve(true);
                    },
                    reject: function () {
                        resolve(false);
                    },
                    resizable: false,
                    draggable: false,
                });
            } else {
                const {value} = await Dialog.confirm({
                    title: header,
                    message: message,
                    okButtonTitle: 'Yes',
                    cancelButtonTitle: 'Cancel',
                });
                if (value) resolve(true);
                else resolve(false);
            }
        })
    })

};

export const showAlert = async (title: string, message: string) => {
    await Dialog.alert({
        title: title,
        message: message,
    });
};

export function validateAskText(message: string): { isValid: boolean, message: string } {
    let isValid = true;
    let errorMessage: string = '';
    if (message.split('').length < 2) {
        isValid = false;
        errorMessage = "Please write some valid message.";
    }

    return {isValid, message: errorMessage};
}

export const storeCurrentContent = (store: IDBStoreName, content: string) => {
    const current = new Date();
    const data = {
        createdAt: current,
        content: content,
        store: store
    }
    return storeObjects(data)
}
export const storeChatsByDeviceID = async  (chats: Message[]) => {
    let store: IDBStoreName = IDBStore.chat;
    getDeviceID().then((device: {identifier:string}) => {
        if (device) {
            chats.forEach(chat => {
                chat.id = device.identifier
            })
            let data = {
                chats: chats,
                store: store,
                id: device.identifier,
                createdAt: new Date(),
            }
            storeObjects(data);
        }
    })

}

function openDatabase(store: IDBStoreName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(store.toString(), 1);

        request.onupgradeneeded = (event: any) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(store)) {
                db.createObjectStore(store, {keyPath: 'id', autoIncrement: true});
            }
        };

        request.onsuccess = (event: any) => {
            resolve(event.target.result);
        };

        request.onerror = (event: any) => {
            reject(event.target.error);
        };
    });
}

function storeObjects(object: {
    createdAt: Date,
    content?: string,
    store: IDBStoreName,
    id?: number | string,
    chats?: any
}) {
    return new Promise((resolve, reject) => {
        openDatabase(object.store).then((db: any) => {
            const transaction = db.transaction([object.store.toString()], 'readwrite');
            const objectStore = transaction.objectStore(object.store);
            object.id = object.id || 1;
            const request = objectStore.put(object);
            request.onsuccess = () => {
                resolve(true);
            };
            request.onerror = (event: any) => {
                reject(event.target.error);
            };
            transaction.oncomplete = () => {
                db.close();
            };
        }).catch((error) => {
            console.error('Error opening database:', error);
            reject(error);
        });
    })
}

export function queryStoreObjects(storeName: IDBStoreName) {
    return new Promise((resolve, reject) => {
        openDatabase(storeName).then((db: any) => {
            const transaction = db.transaction([storeName.toString()], 'readonly');
            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.getAll();
            request.onsuccess = (event: any) => {
                resolve(event.target.result);
            };
            request.onerror = (event: any) => {
                reject(event.target.error);
            };
            transaction.oncomplete = () => {
                db.close();
            };
        }).catch((error) => {
            console.error('Error opening database:', error);
            reject(error);
        });
    })
}

export function clearDatabaseByName(dbName: IDBStoreName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);
        request.onsuccess = (event: any) => {
            const db = event.target.result;
            const transaction = db.transaction(db.objectStoreNames, 'readwrite');
            transaction.oncomplete = () => {
                console.log(`All object stores in ${dbName} have been cleared.`);
                resolve(true);
            };

            transaction.onerror = (event: any) => {
                reject(event.target.error);
                console.error('Transaction error:', event.target.error);
            };

            for (const storeName of db.objectStoreNames) {
                const objectStore = transaction.objectStore(storeName);
                objectStore.clear().onsuccess = () => {
                    console.log(`Cleared object store: ${storeName}`);
                };
            }
            resolve(true);
            db.close();
        };

        request.onerror = (event: any) => {
            console.error('Error opening database:', event.target.error);
            reject(false);
        };
    })
}

export async function vibrateDevice() {
    const info = await getDeviceInfoUsingCapacitor();
    if (info.platform !== 'web') {
        await Haptics.impact({style: ImpactStyle.Medium});
    }
}

export function timeAgo(date: Date | undefined): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - new Date(date || new Date()).getTime()) / 1000);

    const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (const [unit, value] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / value);
        if (interval > 0) {
            return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}

export async function notify(message: string) {
    const info = await getDeviceInfoUsingCapacitor();
    if (info.platform === 'web') {
        new Notification(message);
    } else {

    }
}

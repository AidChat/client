import {useWindowSize} from "../../services/hooks/appHooks";
import {EwindowSizes} from "../enum";
import {Device, DeviceInfo} from "@capacitor/device";
import {getToken} from "firebase/messaging";
import {PushNotifications} from "@capacitor/push-notifications";
import {getFCMMessaging} from "../../firebase.config";
import {ScreenOrientation} from "@capacitor/screen-orientation";
import {StatusBar} from "@capacitor/status-bar";
import {Dialog} from "@capacitor/dialog";

export function formatTime(date: string) {
    return new Date(date).toTimeString().slice(0, 8);
}

export function validateEmail(email: string) {
    // Regular expression for a basic email validation
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
    const info = await Device.getInfo();
    console.log("Device Info ", info)
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


export const showConfirm = async () => {
    const {value} = await Dialog.confirm({
        title: 'Please confirm.',
        message: `Are you sure you'd like to continue?`,
        okButtonTitle: 'Yes',
        cancelButtonTitle: 'Cancel',

    });

    return value
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

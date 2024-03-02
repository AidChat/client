import {useWindowSize} from "../../services/hooks/appHooks";
import {EwindowSizes} from "../enum";

export function formatTime(date: string) {
  return new Date(date).toTimeString().slice(0, 8);
}

export function validateEmail(email: string) {
  // Regular expression for a basic email validation
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export function formatTimeToHHMM(date: any) {
  const d = new Date(date);
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert hours to 12-hour format

  const formattedTime = `${formattedHours}:${String(minutes).padStart(
    2,
    "0"
  )} ${amOrPm}`;
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
  const day = String(d.getDate()).padStart(2, "0"); // Get day and pad with leading zero if needed
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Get month (+1 because months are zero-indexed) and pad with leading zero if needed
  const year = d.getFullYear(); // Get full year
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

export function useResponsizeClass(
  size: EwindowSizes,
  classArr: string[]
): string {
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

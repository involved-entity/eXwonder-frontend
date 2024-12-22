import axios, { AxiosRequestConfig } from "axios";
import client from "../client/index.js";
import { IResponse } from "../types/helpers";
import { useAuthenticationStore } from "../stores/authenticationStore.ts";
import { useAccountStore } from "../stores/accountStore.ts";
import { z } from "zod";
import { NotificationsUrl } from "../settings.ts";

enum Methods {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  DELETE = "delete",
}

async function request(
  method: Methods,
  url: string,
  data?: object,
  config?: AxiosRequestConfig,
  ...expectedStatuses: Array<number>
): Promise<IResponse> {
  if (expectedStatuses.length === 0) {
    expectedStatuses = [axios.HttpStatusCode.Ok];
  }

  const args: [string, object?, AxiosRequestConfig?] = data
    ? [url, data, config]
    : [url, config];
  const response = await client[method](...args).catch(error => error);

  if (expectedStatuses.includes(response.status)) {
    return {
      success: true,
      data: response.data,
    };
  } else {
    return {
      success: false,
      data: response.response.data,
    };
  }
}

function isElementInViewport(el?: HTMLElement): boolean {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function clearActiveClasses() {
  const removeActive = document.querySelectorAll<HTMLElement>(".remove-active");
  removeActive.forEach(el => {
    el.classList.remove("active");
  });
}

function checkIsEmailValid(email: string): boolean {
  if (email.length === 0) return true;
  const emailChecker = z.string().email();
  return emailChecker.safeParse(email).success;
}

function arrayBufferToBase64(buffer: unknown) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function parseDate(dateStr: string): Date {
  const [time, date] = dateStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  const [day, month, year] = date.split(".").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

function messengerFormatDate(input: string): string {
  const [time, date] = input.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  const [day, month, year] = date.split(".").map(Number);
  const inputDate = new Date(year, month - 1, day, hours, minutes);
  const now = new Date();

  const timeDiff = now.getTime() - inputDate.getTime();

  const twelveHours = 12 * 60 * 60 * 1000;
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  if (timeDiff < twelveHours) {
    return `${hours}:${String(minutes).padStart(2, "0")}`;
  } else if (timeDiff < sevenDays) {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekdays[inputDate.getDay()];
  } else {
    return `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
  }
}

export {
  request,
  Methods,
  isElementInViewport,
  clearActiveClasses,
  checkIsEmailValid,
  initSocketConnection,
  arrayBufferToBase64,
  messengerFormatDate,
  parseDate,
};

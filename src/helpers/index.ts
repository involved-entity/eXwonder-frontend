import axios, { AxiosRequestConfig } from "axios";
import client from "../client/index.js";
import { IResponse } from "../types/helpers";
import { z } from "zod";

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
  ...expectedStatuses: number[]
): Promise<IResponse> {
  const statuses = expectedStatuses.length
    ? expectedStatuses
    : [axios.HttpStatusCode.Ok];

  try {
    const response = await client[method](url, data, config);
    return statuses.includes(response.status)
      ? { success: true, data: response.data }
      : { success: false, data: response.data };
  } catch (error) {
    return { success: false, data: error.response?.data || null };
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

function clearActiveClasses(): void {
  document.querySelectorAll<HTMLElement>(".remove-active").forEach(el => {
    el.classList.remove("active");
  });
}

function checkIsEmailValid(email: string): boolean {
  return email.length === 0 || z.string().email().safeParse(email).success;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
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
  arrayBufferToBase64,
  messengerFormatDate,
  parseDate,
};

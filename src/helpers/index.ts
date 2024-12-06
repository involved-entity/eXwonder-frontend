import axios, { AxiosRequestConfig } from "axios";
import client from "../client/index.js";
import { IResponse } from "@/types/helpers";
import {z} from 'zod';

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
  if (email.length === 0) return true
  const emailChecker = z.string().email()
  return emailChecker.safeParse(email).success
}

export { request, Methods, isElementInViewport, clearActiveClasses, checkIsEmailValid };

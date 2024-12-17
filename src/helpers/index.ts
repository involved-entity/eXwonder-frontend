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

function onSocketOpen() {
  const authStore = useAuthenticationStore();
  let data = JSON.stringify({
    type: "authenticate",
    token: authStore.token,
    user_id: authStore.user.id,
  });
  authStore.socket!.send(data);
  data = JSON.stringify({
    type: "get_unreaded_notifications",
  });
  authStore.socket!.send(data);
}

function onSocketMessage(event: object) {
  const accountStore = useAccountStore();
  const data = JSON.parse(event.data);
  if (data.type === "notify") {
    accountStore.notifications.unshift(data.payload);
  } else if (data.type === "get_unreaded_notifications") {
    accountStore.notifications.push(...data.payload);
  }
}

function initSocketConnection() {
  const authStore = useAuthenticationStore();
  if (authStore.isAuth) {
    authStore.socket = new WebSocket(NotificationsUrl);
    authStore.socket.onopen = onSocketOpen;
    authStore.socket.onmessage = onSocketMessage;
    authStore.socket.onclose = function (event) {
      console.log("Соединение закрыто:", event);
      if (event.code) {
        console.error("Код закрытия:", event.code);
      }
    };
  }
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export {
  request,
  Methods,
  isElementInViewport,
  clearActiveClasses,
  checkIsEmailValid,
  initSocketConnection,
  arrayBufferToBase64
};

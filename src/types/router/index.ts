import { RouteRecordRaw } from "vue-router";

interface IRouteMeta {
  requireLogin?: boolean;
  requireNoLogin?: boolean;
  fullWidth?: boolean;
}

export type IRoute = RouteRecordRaw & {
  meta: IRouteMeta;
};

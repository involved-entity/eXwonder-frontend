import { RouteRecordRaw } from "vue-router";

interface IRouteMeta {
  requireLogin?: boolean;
  requireNoLogin?: boolean;
  fullWidth?: boolean;
}

type IRoute = RouteRecordRaw & {
  meta: IRouteMeta;
};

export { IRoute };

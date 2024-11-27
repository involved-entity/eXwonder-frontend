import { RouteRecordRaw } from "vue-router";

interface IRouteMeta {
  requireLogin?: boolean;
  requireNoLogin?: boolean;
}

type IRoute = RouteRecordRaw & {
  meta: IRouteMeta;
};

export { IRoute };

import { RouteLocationRaw } from "vue-router";

type SvgPathType = string;

export interface IMobileNavDrawerItem {
  name: string;
  label: string;
  iconPath: SvgPathType;
}

import { AxiosResponse } from "axios";

export interface IResponse {
  success: boolean;
  data: AxiosResponse["data"];
}

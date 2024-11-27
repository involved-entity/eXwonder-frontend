import { AxiosResponse } from "axios";

interface IResponse {
  success: boolean;
  data: AxiosResponse["data"];
}

export { IResponse };

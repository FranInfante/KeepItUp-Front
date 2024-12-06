import { environment } from "../../environments/environments";

export const WEIGHINS_API_URL = environment.endpointUrl + 'weighins';

export const BASE = environment.base;

export const WEIGHIN_ROUTES = {
    list: () => `${WEIGHINS_API_URL}`,
    create: () => `${WEIGHINS_API_URL}`
  };
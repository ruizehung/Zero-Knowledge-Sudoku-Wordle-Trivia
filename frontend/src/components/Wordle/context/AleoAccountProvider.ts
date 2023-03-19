import { createContext } from "react";

export type AleoAccount = {
    address: string;
    view_key: string;
}

export const AleoAccountProvider = createContext<AleoAccount>({address: "", view_key: ""});
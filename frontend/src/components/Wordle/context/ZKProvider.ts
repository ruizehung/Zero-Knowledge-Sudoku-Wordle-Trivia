import { createContext } from "react";
import { ZK_FRAMEWORK } from "../../../constant";

export type ZKContext = {
    zkFramework: ZK_FRAMEWORK;
    aleoAddress: string;
}

export const ZKProvider = createContext<ZKContext>({aleoAddress: "", zkFramework: ZK_FRAMEWORK.ALEO});
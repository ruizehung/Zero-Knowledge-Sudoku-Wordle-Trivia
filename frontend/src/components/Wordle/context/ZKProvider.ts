import { createContext } from "react";
import { ZK_FRAMEWORK } from "../../../constant";

export type ZKContext = {
    zkFramework: ZK_FRAMEWORK;
    aleoAddress: string;
    aleoViewKey: string;
}

export const ZKProvider = createContext<ZKContext>({aleoAddress: "", aleoViewKey: "", zkFramework: ZK_FRAMEWORK.ALEO});
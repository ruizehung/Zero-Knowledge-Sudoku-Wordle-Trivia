import { createContext } from "react";

export type SolutionHashContext = {
    solutionHash: string
}

export const SolutionHashProvider = createContext<SolutionHashContext>({solutionHash: ""});
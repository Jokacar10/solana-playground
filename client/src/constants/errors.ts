import { GITHUB_URL } from "./project";

interface ConvertedError {
  [key: string]: string;
}

export const RPC_ERROR: ConvertedError = {
  "503,":
    "RPC unavailable. Please try a different endpoint from the settings or try again.",
  "429,":
    "Too many requests for this endpoint. You can change the endpoint from the settings or try again later.",
  "Network request failed":
    "RPC endpoint is not responsive. Please change the endpoint from the settings.",
};

export const OTHER_ERROR: ConvertedError = {
  "Failed to fetch": `Unable to build. If the problem persists, please consider creating an issue about the problem in ${GITHUB_URL}/issues`,
  "unable to infer src variant": "Enum variant does not exist.",
  "program.methods[txVals.name] is not a function":
    "Test component is not up to date.",
};

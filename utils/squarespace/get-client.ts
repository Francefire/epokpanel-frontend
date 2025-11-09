import { getApiKeys } from "../api-keys";
import { createSquarespaceClient } from "./client";

export const getSquarespaceClient = async () => {
    const config = await getApiKeys();
    //const baseApiUrl = `https://api.squarespace.com/v2`

    if(!config.squareSpaceConfig) {
        throw new Error("Squarespace configuration not found");
    }

    return createSquarespaceClient(config.squareSpaceConfig);
}
    
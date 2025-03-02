import { defineStore } from 'pinia';

export const useApiStore = defineStore('api', () => {

    async function Request(url, method, body, headers = {}) {
        switch (true) {
            case body instanceof File: {
                headers["Content-Type"] = body.type;
                headers["Content-Filename"] = body.name;
                break;
            }
            case body instanceof Blob: {
                headers["Content-Type"] = body.type;
                break;
            }
            case body instanceof FormData: {
                break;
            }
            case typeof body === 'object': {
                headers["Content-Type"] = "application/json";
                body = JSON.stringify(body);
                break;
            }
        }

        const response = await fetch(url, {
            method,
            mode: "cors",
            credentials: "omit",
            headers,
            cache: "no-cache",
            referrerPolicy: "strict-origin",
            body
        });

        if (response.ok) {
            const contentType = response.headers.get("content-type") ?? "";
            switch (true) {
                case contentType.includes("application/json"): {
                    return await response.json();
                }
                case contentType.includes("text/plain"): {
                    return await response.text();
                }
                default: {
                    return response;
                }
            }
        } else {
            const result = await response.text();
            switch (response.status) {
                default: {
                    const error = new Error(result);
                    error.status = response.status;
                    throw error;
                }
            }
        }
    }

    return { Request };
});
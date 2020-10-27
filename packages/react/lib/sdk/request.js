import PicnicError from "../exceptions/PicnicError";
function getAuthHeaders(settings) {
    return { "x-api-key": settings.token };
}
function getUrl(settings, path) {
    let sfu = settings.endpoint.endsWith("/") ? "sfu" : "/sfu";
    if (!path.startsWith("/")) {
        sfu += "/";
    }
    return settings.endpoint + sfu + path;
}
export async function get(settings, path) {
    const res = await fetch(getUrl(settings, path), {
        headers: getAuthHeaders(settings),
    });
    if (!res.ok) {
        throw new PicnicError(`get request failed with status ${res.status}`, null);
    }
    const response = await res.json();
    if (!response.success) {
        throw new PicnicError(`get request failed with error: ${JSON.stringify(response.error)}`, null);
    }
    return response.payload;
}
export async function post(settings, path, data) {
    const res = await fetch(getUrl(settings, path), {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(settings),
        },
    });
    if (!res.ok) {
        throw new PicnicError(`get request failed with status ${res.status}`, null);
    }
    const response = await res.json();
    if (!response.success) {
        throw new PicnicError(`get request failed with error: ${JSON.stringify(response.error)}`, null);
    }
    return response.payload;
}
//# sourceMappingURL=request.js.map
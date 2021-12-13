export function getUrlParam(url, paramName) {
    return url.split(paramName + "=")[1].split("&")[0]
}
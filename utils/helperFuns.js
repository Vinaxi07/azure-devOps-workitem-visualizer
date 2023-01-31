const validateResp = (output) => {
    let respStatusText = output.statusText || output.response.statusText
    if (respStatusText !== "OK") {
        throw new Error(respStatusText);
    }
}

const getDisplayName = (name) => {
    let afterLastSlash = name.substring(name.lastIndexOf('\\') + 1);
    return afterLastSlash
}


// get item id by url string
let getItemIdByURL = (url = '') => {
    let strAry = url.split('/')
    return strAry.slice(strAry.length - 1, strAry.length)?.[0] || undefined
}

export { validateResp, getDisplayName,  getItemIdByURL }
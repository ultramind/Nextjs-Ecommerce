export function removeEmptyProperties(obj: { [key: string]: any }) {
    for (const prop in obj) {
        if (obj[prop] === undefined || obj[prop] === "" || obj[prop] === 0 || obj[prop]?.length === 0) {
            delete obj[prop];
        }
    }
}
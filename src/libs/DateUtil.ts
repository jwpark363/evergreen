export function stringToYMD(date_str:string,separator:string="-") {
    return toYMD(new Date(date_str),separator)
}
export function stringToHM(date_str:string,separator:string=":") {
    return toHM(new Date(date_str),separator)
}
export function toYMD(date:Date,separator:string="-") {
    const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const yyyy = kst.getUTCFullYear();
    const mm = String(kst.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(kst.getUTCDate()).padStart(2, "0");
    return `${yyyy}${separator}${mm}${separator}${dd}`;
}
export function toHM(date:Date,separator:string=":") {
    const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const hh = String(kst.getUTCHours()).padStart(2, "0");
    const mi = String(kst.getUTCMinutes()).padStart(2, "0");
    return `${hh}${separator}${mi}`;
}
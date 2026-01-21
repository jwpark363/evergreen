export function checkPhoneFormat(phone:string){
    const phone_regex = /^010\d{4}\d{4}$/;
    return phone_regex.test(phone)
}
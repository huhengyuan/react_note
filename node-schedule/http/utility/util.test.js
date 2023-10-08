function isEmail(str) {
    let email_list = str.split(';');
    let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return str.split(';').every(e => reg.test(e));
}
console.log(isEmail('tanghui@genuine-opto.com'))

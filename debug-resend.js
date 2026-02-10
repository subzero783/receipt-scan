const { Resend } = require('resend');

const resend = new Resend('re_123');
console.log('Resend Keys:', Object.keys(resend));

if (resend.emails) {
    console.log('Has resend.emails');
    if (resend.emails.receiving) {
        console.log('Has resend.emails.receiving');
        if (resend.emails.receiving.attachments) {
            console.log('Has resend.emails.receiving.attachments! SUCCESS');
            console.log('Attachments methods:', Object.getPrototypeOf(resend.emails.receiving.attachments));
        } else {
            console.log('Missing resend.emails.receiving.attachments');
        }
    } else {
        console.log('Missing resend.emails.receiving');
    }
} else {
    console.log('Missing resend.emails');
}

try {
    const pkg = require('resend/package.json');
    console.log('Resend Version:', pkg.version);
} catch (e) {
    console.log('Could not read package.json');
}

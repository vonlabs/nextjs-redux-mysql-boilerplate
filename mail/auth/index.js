import {sendEmail} from '../sendEmail'

export async function sendActivationEmail (payload) {
    console.log('E-mail: sendActivationEmail')
    sendEmail(
        payload.email, 
        `[${process.env.SERVICE_NAME}] Account activation`, 
        `Hi!\n\nActive your account using the following url:\n${process.env.SERVICE_URL}/api/auth/activateAccount?no=${payload.activationHash}\n\nBest regards!\n${process.env.SERVICE_NAME} Team`, // plain text body`
    );
}

export async function sendResetPasswordEmail (payload) {
    console.log('E-mail: sendResetPasswordEmail')
    sendEmail(
        payload.email, 
        `[${process.env.SERVICE_NAME}] Password reset`, 
        `Hi!\n\nReset your account password using the following url:\n${process.env.SERVICE_URL}/api/auth/resetPassword?no=${payload.activationHash}\n\nBest regards!\n${process.env.SERVICE_NAME} Team`, // plain text body`
    );
}


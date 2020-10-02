import {getUserID, insertPasswordResetLink} from '../../../mysql/auth';
import {sendResetPasswordEmail} from '../../../mail/auth'
import {generateRandom, validateEmail} from '../../../utils/functions'


export default async function generateResetPasswordLink(req, res) {
    console.log('API: generateResetPasswordLink')
    if (req.method !== 'POST') {
      res.status(500).json({ status: 500, msg: "Wrong Method" });
      return;
    } 
    let email = req.body.email;
    let provider = 'native';
    let object = {email, provider}

    //Validation
    if(!validateEmail(email)){
        res.status(500).json({ status: 500, msg: "Email not validated" });
        return;
    }

    let userID = await getUserID(object);

    if (userID !== null){
        let linkToResetPassword = await generateRandom();
        let linkToResetPassExpDate = Date.now() + (30 * 60);
        let payload = {
            linkToResetPassword,
            linkToResetPassExpDate,
            userID
        }
        let response = await insertPasswordResetLink(payload);
        if (response.status === 200) {
            sendResetPasswordEmail(email, linkToResetPassword);
        }
    } 

    res.status(200).json({ status: 200, msg: "Reset link sent to your e-mail" })
}
  
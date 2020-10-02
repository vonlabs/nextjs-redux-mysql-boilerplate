import {getUserID, getUserIDAndExpDateOfLinkToResetPass, changePasswordWithResetLink, changePasswordWithUserID} from '../../../mysql/auth';
import {validatePassword} from '../../../utils/functions'
import {hashSync} from 'bcrypt'

export default async function changePassword(req, res) {
    console.log('API: changePassword');
    if (req.method !== 'POST') {
        res.status(500).json({ status: 500, msg: "Wrong Method" });
        return;
    } 

    let no = req.body.no;
    let query1, query2, query3;
    if(no){
        console.log('API: api_changePasswordWithResetLink', no)
        if (no < 1577788758626) res.status(500).json({ status: 304, msg: "Link Expired" })
        
        query1 = await getUserIDAndExpDateOfLinkToResetPass(no);
        console.log('query1',query1);
        if (query1.status !== 200) {
            res.status(500).json({ status: 500, msg: "Password not changed" })
            return;
        }
        if (parseInt(query1.expiration) < Date.now())  {
            res.status(500).json({ status: 304, msg: "Link Expired" })
            return;
        }
        if (!validatePassword(req.body.password))  {
            res.status(406).json({ status: 406, msg: "Password not validated"})
            return;
        }
        let hashed = hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS));
        query2 = await changePasswordWithResetLink({userId: query1.userId, password: hashed})
        if (query2.status !== 200) {
            res.status(500).json({ status: 500, msg: "Password not changed" });
            return;
        }
        res.status(200).json({ status: 200, msg: "OK" })
    }
    else if (req.headers.authorization) {
  
        // let verificationObject = await verifyAuth(req.headers.authorization);
        // if(verificationObject.status === 400) {
        //     res.status(500).json({ status: 500, msg: "Password not changed" })
        //     return 0;
        // } else if(verificationObject.status === 401) {
        //     res.status(401).json({ status: 401, msg: "Unauthorized" })
        //     return 0;
        // }  

        // if (validatePassword(req.body.password)){
        //     console.log(verificationObject)
        //     let UserID = await getUserID({email: verificationObject.email, provider: verificationObject.provider})
        //     console.log(UserID)
        //     if (UserID !== null) {
        //         query3 = await changePasswordWithUserID({UserID, password: req.body.password})
        //         if (query3.status === 200) res.status(200).json({ status: 200, msg: "OK" })
        //     }
        // }
        res.status(500).json({ status: 500, msg: "Password not changed" })
    } else {
        res.status(500).json({ status: 500, msg: "Error" })
    }
}
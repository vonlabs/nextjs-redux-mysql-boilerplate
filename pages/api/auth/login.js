import {getUserIDAndActivation, getHashedPasswordOfUser, insertFailedLogin} from  '../../../mysql/auth';
import { sign } from 'jsonwebtoken';
import {compareSync} from 'bcrypt'

export default async function handle(req, res) {
    console.log('API: login')
    if (req.method !== 'POST') {
        res.status(500).json({ status: 500, msg: "Wrong Method" });
        return;
    } 
    let email = req.body.email;
    let password = req.body.password;
    let provider = 'native'
    let payload = await getUserIDAndActivation({email, provider});

    if (payload.Activated != 1){
        res.status(500).json({ status: 201, msg: "Not Activated" })
    }

    if (payload.UserID !== null){

        //check last bad login tries


        let hash = await getHashedPasswordOfUser(payload.UserID);
        if (hash){
            let checkHash = compareSync(password, hash);
            if(checkHash){
                let token = { 
                    email,
                    provider
                }
                let jwt = await sign({ 
                    ...token,
            //     iat: Math.floor(Date.now() / 1000) - 30
                }, process.env.JWT_KEY, { expiresIn: '365d' });
                res.status(200)
                res.setHeader('Set-Cookie', `token=${jwt}; Expires=Wed, 21 Oct 2025 07:29:00 GMT; SameSite=Secure; Path=/; ${process.env.NODE_ENV === 'development' ? '' : 'Secure;'} HttpOnly`)
                res.json({ status: 200, msg: "Ok", token })
                return;
            } else {
                await insertFailedLogin(payload.UserID);
                res.status(500).json({ status: 500, msg: "Unable To Login" })
            }
        } else {
            res.status(500).json({ status: 500, msg: "Unable To Login" })
        }
    } else {
        res.status(500).json({ status: 500, msg: "Unable To Login" })
    }
}
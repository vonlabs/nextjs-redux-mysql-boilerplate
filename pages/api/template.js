import { verifyAuth } from '../../utils/functions';

export default async function handle(req, res) {
    console.log('API: template');
    if (req.method !== 'POST') {
        res.status(500).json({ status: 500, msg: "Wrong Method" });
        return;
    } else if (!verifyAuth(req.headers.cookie).authorised){
        res.status(401).json({status: 401, msg: "Unauthorized"});
        return;
    } 
    res.status(200).json({status: 200});
}
import {activateAccount, getUserIDFromActivationLink, removeActivatorLink} from '../../../mysql/auth';

export default async function api_activateAccount(req, res) {
  console.log('API: activateAccount');
  if (req.method !== 'GET') {
    res.status(500).json({ status: 500, msg: "Wrong Method" });
    return;
  } 
  let query1,query2;
  let no = parseInt(req.query.no);
  if (no > 1577788758626) { //Date.now()
    query1 = await getUserIDFromActivationLink(no);
  } else {
    res.status(500).json({ status: 500, msg: "Error" })
    return;
  }
  if (query1 === undefined){
    res.status(500).json({ status: 500, msg: "Error" })
  } else if (query1.userID > 0) {
    query2 = await activateAccount(query1.userID)
    if (query2.status === 200) {
      removeActivatorLink(no);
        res.status(200).json({ status: 200, msg: "Ok" })
    } else {
        res.status(500).json({ status: 500, msg: "Error" })
    }
  } else {
    res.status(500).json({ status: 500, msg: "Error" })
  }
}


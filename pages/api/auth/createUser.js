import {createUser, insertPassword, insertActivationLink} from '../../../mysql/auth';
import {sendActivationEmail} from '../../../mail/auth'
import {generateRandom, validateEmail, validatePassword} from '../../../utils/functions'
import {hashSync} from 'bcrypt'


export default async function createUserAPI(req, res) {
  console.log('API: createUser', req.body)
  if (req.method !== 'POST') {
    res.status(500).json({ status: 500, msg: "Wrong Method" });
    return;
  } 

  let email = req.body.email;
  let name = req.body.name || '';
  let username = req.body.username || '';
  let password = req.body.password;

  //Validation
  if(!validateEmail(email)){
    res.status(500).json({ status: 500, msg: "Email not validated" });
    return;
  }
  else if(!validatePassword(password)){
    res.status(500).json({ status: 500, msg: "Password not validated" });
    return;
  }

  //User
  let query = await createUser({email, provider: 'native', activated: false, name, username});
  console.log(query)
  if(query.status === 400) {
    res.status(500).json({ status: 500, msg: "Error" })
    return;
  } else if (query.insertId === false) {
    res.status(500).json({ status: 304, msg: "User Exists" })
    return;
  }

  //Password
  let hashed = hashSync(password, parseInt(process.env.SALT_ROUNDS));
  await insertPassword({userID: query.insertId, password: hashed});

  //Activation Link
  let activationHash = await generateRandom();
  let query3 = await insertActivationLink({userID: query.insertId, activationHash});
  console.log('query3', query3)
  if (query3.status === 200){
    await sendActivationEmail({email, activationHash});
  }
  
  res.status(200).json({ status: 200, msg: "Ok" })
}

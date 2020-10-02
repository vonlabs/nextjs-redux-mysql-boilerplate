export async function generateRandom(){
    let string = Date.now()+Math.random().toString()+Math.random().toString();
    string = string.replace(/[.]/g, '');
    return string;
}

export function validatePassword (password){
    var strongRegex = new RegExp("^(?=.*[A-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return strongRegex.test(password);
    // ^	The password string will start this way
    // (?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character
    // (?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character
    // (?=.*[0-9])	The string must contain at least 1 numeric character
    // (?=.[!@#\$%\^&])	The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
    // (?=.{8,})	The string must be eight characters or longer
}

export function validateEmail (email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

import { verify } from 'jsonwebtoken';
export function verifyAuth(jwt) {
    console.log('Functions: verifyAuth');
    if (!jwt){
      return {authorised: false, status: 401, msg: "Unauthorized"};
    }
    jwt = jwt.replace('token=','');
    let verifyToken = {};
    try {
      verifyToken = verify(jwt, process.env.JWT_KEY);
    } catch(err) {
      console.warn(err);
      //e.g. err.name = 'TokenExpiredError'
      return {authorised: false, status: 401, msg: "Unauthorized"};
    }
    
    if(
        (verifyToken.provider === 'google' || verifyToken.provider === 'native') 
          && 
        verifyToken.email
      ){
      return {authorised: true, status: 200, msg: "Authorized", email: verifyToken.email, provider: verifyToken.provider }
    } else {
      return {authorised: false, status: 401, msg: "Unauthorized"};
    }
  }
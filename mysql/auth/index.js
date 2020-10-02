import {queryDB, queryPassportDB} from '../index'
const escape = require('sql-template-strings')

export async function createUser (payload) {
    console.log('MySQL: createUser');
    let query = await queryDB(escape`
    INSERT INTO users 
    (Email,ProviderID,EmailApproval,Activated,Username,Name,created_at) 
    VALUES (
      ${payload.email},
      (SELECT ProviderID FROM login_providers WHERE ProviderName = ${payload.provider}),
      1,
      ${payload.activated},
      ${payload.username},
      ${payload.name},
      ${Date.now()}
    )
    ON DUPLICATE KEY UPDATE UserID=UserID;
    `)
    let insertId = false;
    if(query.insertId !== 0) insertId = query.insertId;  //if insertId is present, that means that user was created
    if (query.error) {
      return {status: 400}
    }
    return {status: 200, insertId}
}

export async function getUserID (payload) {
    console.log('MySQL: getUserID');
    let query = await queryDB(escape`
      SELECT
        UserID
      FROM
        users
      WHERE   
        Email = ${payload.email}
          AND
        ProviderID = (SELECT ProviderID FROM login_providers WHERE ProviderName = ${payload.provider});
    `);
    console.log(query)
    if (query.length > 0 && query[0].UserID){
      query = query[0].UserID
    } else query = null
    return query
}
  
  export async function getUserIDAndActivation (payload) {
    console.log('MySQL getUserIDAndActivation', payload);
    let query = await queryDB(escape`
      SELECT
        UserID, Activated
      FROM
        users
      WHERE   
        Email = ${payload.email}
          AND
        ProviderID = (SELECT ProviderID FROM login_providers WHERE ProviderName = ${payload.provider})  
        ;
    `);
    console.log(query)
    if (query.length > 0 && query[0].UserID){
      let UserID = query[0].UserID
      let Activated = query[0].Activated
      return {UserID, Activated}
    } else {
      return {status: 500}
    }
  }

  export async function setEmailApproval (payload) {
    console.log('MySQL setEmailApproval');
    let query = await queryDB(escape`
      UPDATE
        users
      SET
        EmailApproval = ${payload.boolean}
      WHERE   
        Email = ${payload.email};
          AND
        ProviderID = (SELECT ProviderID FROM login_providers WHERE ProviderName = ${payload.provider})  
    `);
    console.log(query)
    if (query.affectedRows === 1){
      return {status: 200}
    } else {
      return {status: 500}
    }  
  }

  export async function activateAccount (payload) {
    console.log('MySQL: activateAccount');
    let query = await queryDB(escape`
      UPDATE
        users
      SET
        Activated = 1
      WHERE   
        UserID = ${payload}
          AND
        ProviderID = (SELECT ProviderID FROM login_providers WHERE ProviderName = 'native')  
    `);
    if (query.affectedRows === 1 && query.warningCount === 0){
      return {status: 200}
    } else {
      return {status: 500}
    }  
  }

  export async function insertPassword (payload) {
    console.log('MySQL: insertPassport');
    let query = await queryPassportDB(escape`
    INSERT INTO passport 
        (UserID,password,created_at) 
        VALUES (
            ${payload.userID},
            ${payload.password},
            ${Date.now()}  
        )
        ON DUPLICATE KEY UPDATE password=${payload.password};
    `);
    if (query.error) {
      return {status: 400}
    }
    return {status: 200}
  }

  export async function getUserIDFromActivationLink (payload) {
    console.log('MySQL: getUserIDFromActivationLink');
    let query = await queryPassportDB(escape`
    SELECT UserID
    FROM activation 
    WHERE linkToActivate=${payload}
    `);
    console.log(query)
    if (query.error || query[0] === undefined) {
      return {status: 400}
    }
    return {status: 200, userID: query[0].UserID}
  }
  

  export async function removeActivatorLink (payload) {
    console.log('MySQL: removeActivatorLink');
    let query = await queryPassportDB(escape`
      DELETE  FROM activation
      WHERE  linkToActivate = ${payload};
    `);
    if (query.error) {
      return {status: 400}
    }
    return {status: 200}
  }


  export async function insertPasswordResetLink (payload) {
    console.log('insertPasswordResetLink');
    let query = await queryPassportDB(escape`
        INSERT INTO resetpassword 
            (UserID,linkToResetPassword,expiration,created_at) 
        VALUES (
            ${payload.userID},
            ${payload.linkToResetPassword},
            ${payload.linkToResetPassExpDate},
            ${Date.now()}
        )
        ON DUPLICATE KEY UPDATE linkToResetPassword=${payload.linkToResetPassword},
        expiration=${payload.linkToResetPassExpDate};
    `);
    if (query.changedRows === 1) {
      return {status: 200}
    } else 
    return {status: 400}
  }

  
  export async function insertActivationLink (payload) {
    console.log('MySQL: insertActivationLink');
    let query = await queryPassportDB(escape`
        INSERT INTO activation 
            (UserID,linkToActivate) 
        VALUES (
            ${payload.userID},
            ${payload.activationHash}
        )
        ON DUPLICATE KEY UPDATE linkToActivate=${payload.activationHash};
    `);
    console.log(query)
    if (query.affectedRows === 1) {
      return {status: 200}
    } else 
    return {status: 400}
  }

  export async function getUserIDAndExpDateOfLinkToResetPass (payload) {
    console.log('MuSQL: getUserIDAndExpDateOfLinkToResetPass');
    let query = await queryPassportDB(escape`
      SELECT UserID, expiration
      FROM resetpassword 
      WHERE linkToResetPassword=${payload}
    `);
    if (query.error || query[0] === undefined) {
      return {status: 400}
    }
    return {status: 200, expiration: query[0].expiration, userId: query[0].UserID }
  }

  export async function changePasswordWithResetLink (payload) {
    console.log('MySQL: changePasswordWithResetLink');
    let query = await queryPassportDB(escape`
      UPDATE passport
      SET    password = ${payload.password}
      WHERE  UserID = ${payload.userId};
    `);
    console.log(query)
    if (query.changedRows === 1) {
      return {status: 200}
    } else {
      return {status: 400}
    }
  }

  export async function changePasswordWithUserID (payload) {
    console.log('MYSQL changePasswordWithUserID');
    let query = await queryPassportDB(escape`
      UPDATE passport
      SET    password = ${payload.password}
      WHERE  UserID = ${payload.UserID};
    `);
    if (query.changedRows === 1) {
      return {status: 200}
    } else 
    return {status: 400}
  }

  export async function getHashedPasswordOfUser (userId) {
    console.log('MySQL: getHashedPasswordOfUser');
    let query = await queryPassportDB(escape`
      SELECT password
      FROM passport 
      WHERE UserID   = ${userId}
    `);
    if (query.length > 0){
      query = query[0].password
    } else query = false
    return query
  }

  export async function insertFailedLogin (userId) {
    console.log('MySQL: insertFailedLogin');
    let query = await queryPassportDB(escape`
    INSERT INTO logintry 
        (UserID,created_at) 
    VALUES (
        ${userId},
        ${Date.now()}
    )
    `);
  }



  
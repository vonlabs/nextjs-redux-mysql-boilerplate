const mysql = require('serverless-mysql');

const db = mysql({
  config: {
    host     : process.env.MYSQL_HOST,
    database : process.env.MYSQL_DATABASE_NAME,
    user     : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD
  }
})

const db_passport = mysql({
  config: {
    host     : process.env.MYSQL_HOST_PASSPORT,
    database : process.env.MYSQL_DATABASE_NAME_PASSPORT,
    user     : process.env.MYSQL_USERNAME_PASSPORT,
    password : process.env.MYSQL_PASSWORD_PASSPORT
  }
})
  
exports.queryDB = async (query) => {
  let results = await db.query(query);
  await db.end();
  return results
}

exports.queryPassportDB = async (query) => {
  let results = await db_passport.query(query);
  await db_passport.end();
  return results
}
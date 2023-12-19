const client = require("../../connect/PgAdmin");
//  bcrypt
const bcrypt = require("bcrypt");


const getLogin = async (req, res) => {
  client.query("SELECT config.fn_get_active_accounts()", (err, result) => {
    if (err) {
      console.log(err.stack);
      // throw err;
    } else {
        res.send(result.rows);
    }
  });
};




const postLogin = async (req, res) => {
  const { email_address, password } = req.body;
    console.log(email_address, "email_address");
    console.log(password, "password");
    console.log(req.body, "req.body");
//   console.log(clientToken(), "clientToken()");
  client.query(
    `SELECT * FROM config.user_login where email_address = '${email_address}'`,
    (err, result) => {
      if (err) {
        console.log(err.stack);
        // throw err;
      } else {
        console.log(result.rows);
        // `SELECT * FROM config.fn_user_login_validate('[{"email_address":"${email}","password":"${userDetails[0].password}"}]')`;
        const checkVERIFYPasswords = bcrypt.compareSync(
          password,
          result.rows[0].password
        );
        console.log(checkVERIFYPasswords, "checkVERIFYPasswords");
        if (checkVERIFYPasswords) {
          client.query(
            `SELECT * FROM config.fn_user_login_validate('[{"email_address":"${email_address}","password":"${result.rows[0].password}"}]')`,
            (err, result) => {
              if (err) {
                console.log(err.stack);
                // throw err;
              } else {
                if (
                  result.rows[0].user_login_status[0].login_status ===
                  "Login Success"
                ) {
                    client.query(`SELECT config.fn_user_token_get('${result.rows[0].user_login_status[0].client_id}','${email_address}')`, (err, result) => {
                        if (err) {
                            console.log(err.stack);
                            res.send({
                                status: 400,
                                message: "Login Failed",
                                data: {},
                            });
                            // throw err;
                            } else {
                                console.log(result.rows[0]. fn_user_token_get);
                                // add login as success in array and send it to client
                                res.send({
                                    status: 200,
                                    message: "Login Success",
                                    data: result.rows[0]. fn_user_token_get,
                                })
                            }
                    }
                    );
                    // console.log(barrerToken, "barrerToken");
                 
                }
              }
            }
          );
        } else {
          return {
            status: false,
            message: "Invalid Credentials",
            data: {},
          };
        }
      }
    }
  );
};

// export the test function
module.exports = {
  getLogin,
  postLogin,
};

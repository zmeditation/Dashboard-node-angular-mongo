const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = mongoose.model('User');
const Base = require( '../Base' );
const NodeMailer = require( '../helperFunctions/nodemailer/nodemailer' );
const RandomPass = require('../helperFunctions/randomPass')
const { ServerError } = require('../../handlers/errorHandlers');

class PassChange extends Base {
    
  constructor(args) {
    super(args);
  }

  async execute (data) {
    try {
      const { email } = data;
      const user = await User.findOne({ email: email });
            
      if (!user) {
        throw new Error('NOT FOUND EMAIL');
      }
    
      const passLength = 15;
      const password = RandomPass(passLength);  
      const newPassword = await this.passwordHash(password);
      user.password = newPassword;
        
      if (user.password === newPassword) {
        user.save({ validateBeforeSave: false }); 
                    
        const res = await NodeMailer(email, password);

        if (res.success) {
          return { success: true };
        }

        throw new Error('EMAIL SERVICE IS FAIL PLEASE TRY AGAIN');
      }  
    } catch (err) {
      throw new ServerError(err.message, 'FORBIDDEN');        
    }
  }

  passwordHash(pass) {
    try {
      const saltRounds = 10;

      return new Promise((resolve, reject) => {
                
        bcrypt.hash(pass, saltRounds, (err, hash) => {        
          if (err) reject(err); 

          resolve(hash);
        });   
      });
    } catch (error) {
      throw error.message;
    }
  }
}

module.exports = PassChange;
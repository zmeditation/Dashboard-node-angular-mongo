/**
 * @deprecated delete
 */

const mongoose = require("mongoose");
const User = mongoose.model("User");
const Permissions = mongoose.model( "Permissions" );
const { createDeductionSchema } = require( '../../deduction/deductionsHelper/helper' );
const bcrypt = require("bcrypt");
const moment = require('moment');

exports.canAddAllUsers = userObject => {
  return new Promise(async resolve => {
      try {
          userObject.permissions = await Permissions.setPermissions(userObject.role, userObject.wbidType);          
          saveUser(userObject).then(async user => {
              user ? resolve({ user, success: true }) : resolve(false);
          });

      } catch(e) {
          console.error(e);
          resolve(false);
      }
  })
};

exports.canAddAllPubs = (userObject, userTokenId) => {
  return new Promise(async resolve => {
     try {
         const role = userObject.role === "ACCOUNT MANAGER" ? "ACCOUNT MANAGER" : "PUBLISHER";
         const currentUser = await User.find({ _id: userTokenId });
        //  userObject.domains = userObject.domains.usersDomains;
         userObject.role = role;
         userObject.permissions = await Permissions.setPermissions(role, userObject.wbidType);
         if (!['AD OPS', 'CEO', 'ADMIN'].includes(currentUser[0].role) && userObject.role === "PUBLISHER") {
            userObject.am = userTokenId;
            userObject.date_to_connect_am = moment().format('YYYY-MM-DD');
         } else if (!['AD OPS', 'CEO', 'ADMIN'].includes(currentUser[0].role) && userObject.role === "ACCOUNT MANAGER") {
            userObject.sam = userTokenId;
         }
         saveUser( userObject ).then( user => {

             if (!['AD OPS', 'CEO', 'ADMIN'].includes(currentUser[0].role) && user.role === "PUBLISHER") {
                
                User.findOneAndUpdate({ _id: userTokenId }, { $addToSet: { 'connected_users.p': user._id }}).then(status => {
                    if (status) {
                        console.log('User was connected');
                    }
                });
                 resolve({ user, success: true });
             } else if (!['AD OPS', 'CEO', 'ADMIN'].includes(currentUser[0].role) && user.role === "ACCOUNT MANAGER") {
                
                User.findOneAndUpdate({ _id: userTokenId }, { $addToSet: { 'connected_users.am': user._id }}).then(status => {
                    if (status) {
                        console.log('User was connected');
                    }
                });
                resolve({ user, success: true });

             } else if (['AD OPS', 'CEO', 'ADMIN'].includes(currentUser[0].role)) {
                resolve({ user, success: true });
             } else {
                 resolve(false);
             }
         });
     } catch (e) {
         console.error(e);
         resolve(false);
     }
  });
};

exports.canAddOwnPubs = (userObject, userTokenId) => {
  return new Promise(async resolve => {
     try {

        userObject.role = "PUBLISHER";
        userObject.permissions = await Permissions.setPermissions("PUBLISHER", userObject.wbidType);
        userObject.am = userTokenId;
        userObject.date_to_connect_am = moment().format('YYYY-MM-DD');
        saveUser(userObject).then(user => {
            
            if (user) {
                User.findOneAndUpdate({ _id: userTokenId }, { $addToSet: { 'connected_users.p': user._id }}).then(status => {
                    if (status) {
                        console.log('User was connected');
                    }
                });
                resolve({user, success: true});
            } else {
                resolve(false);
            }
        });

    } catch(e) {
         console.error(e);
         resolve(false);
     }
  });
};

function saveUser(body) {

    return new Promise(resolve => {
        // console.log(body);
        let user = new User(body);

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                
                if (err) throw err;
                
                user.password = hash;
                user.role === 'PUBLISHER' && createDeductionSchema(user._id);
             
                user.save((err, user) => {
                    if (err) { return resolve(false) }
                    
                    return resolve(user);
                });
            });
        });
    });
    
}
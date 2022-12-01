const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { ALLOWED_PUBLISHER_VIEW_PERMISSIONS } = require('../constants/permissions');
const User = require('../database/mongoDB/migrations/UserModel');

require('dotenv').config({ path: `${__dirname}/../../.env` });

module.exports = function(passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.SECRET;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({ uuid: jwt_payload.data.id }, (err, user) => {
            if (err || !user) {
                console.log("EEEE????", err, user)
                return done(err, false);
            }

            // user.permissions = user.permissions?.filter(
            //     perm => ALLOWED_PUBLISHER_VIEW_PERMISSIONS.includes(perm)
            // );
            return done(null, user);
        });
    }));
};

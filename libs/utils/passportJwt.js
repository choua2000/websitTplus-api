import fs from 'fs'
import path from 'path'
import passport from 'passport'
import { Users } from '../../models'
import passportJWT from 'passport-jwt'
const ExtractJWT = passportJWT.ExtractJwt;
const StrategyJWT = passportJWT.Strategy;

const pathTo_PubKey = path.join(__dirname, '../certs/pub_key.pem');
const SecretKey = fs.readFileSync(pathTo_PubKey, 'utf8');

/**
 * authenticate user
 * @param {need access token from headers bearer} 
 * @param {if true} next to middleware
 * @param {if invalid token or expired token} Unauthorized 
 */
 passport.use(
    new StrategyJWT({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: SecretKey, algorithm: ["RS256"]
    }, function (jwt_paylod, done) {
        console.log(jwt_paylod);
        return Users.findOne({ where: { id: jwt_paylod.id } }).then((user) => {
            return done(null, user);
        }).catch((error) => {
            return done(error);
        });
    })
)
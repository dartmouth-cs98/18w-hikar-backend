import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user_model';

const localOptions = { usernameField: 'username' };

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.AUTH_SECRET,
};

/* Verify user based on email and password */
const localLogin = new LocalStrategy(localOptions, (username, password, done) => {
  User.findOne({ username }, '+password', (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    /* Check to see if the passwords match */
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        done(err);
      } else if (!isMatch) {
        done(null, false);
      } else {
        done(null, user);
      }
    });
  });
});

/* Verify user based on request token */
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if (err) {
      done(err, false);
    } else if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

/* Tell passport to use both strategies */
passport.use(jwtLogin);
passport.use(localLogin);

export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireSignin = passport.authenticate('local', { session: false });

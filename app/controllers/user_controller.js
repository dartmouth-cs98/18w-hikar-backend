import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';

dotenv.config({ silent: true });

export const getUsers = (req, res, next) => {
  User.find((err, result) => {
    res.send(result);
  });
};

export const UpdateUserInfo = (req, res, next) => {
  const username = req.body.username;

  User.findOne({ username }).then((user) => {
    user.distance = req.body.distance || user.distance;
    if (req.body.trail) {
      const idx = user.trails.findIndex(req.body.trail);
      console.log(idx);
    } else {
      user.trails.push([req.body.trail][1]);
    }
  });
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

// Sign in User. Auth token is sent if credentials are valid
export const signin = (req, res, next) => {
  return res.send({ token: tokenForUser(req.user) });
};

// Sign up new user
export const signup = (req, res, next) => {
  const user = new User();
  const password = req.body.password;
  const username = req.body.username;
  const trails = [];
  console.log(req.body);


  if (!password || !username) {
    return res.status(422).send('You must provide username and password');
  }

  // search Database to see if user pre-exists
  User.findOne({ username }).then((oldUsername) => {
    if (oldUsername) {
      return res.status(422).send('This user already exists!');
    } else {
      user.password = password;
      user.username = username;
      user.Distance = 0;
      user.save().then((result) => {
        console.log(user.password);
        res.send({ token: tokenForUser(result) });
        // res.json({ message: 'User created!' });
      }).catch((error) => {
        res.status(500).json({ error });
      });
    }
  });
};

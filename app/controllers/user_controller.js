import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';
import { sortArray } from '../distance';

dotenv.config({ silent: true });

export const getUsers = (req, res, next) => {
  User.find((err, result) => {
    res.send(result);
  });
};

export const getUser = (req, res, next) => {
  const username = req.params.username;
  User.findOne({ username }, (err, result) => {
    res.send(result);
  });
};


export const UpdateUserInfo = (req, res, next) => {
  const username = req.params.username;

  User.findOne({ username }).then((user) => {
    console.log(user);

    if (req.body.distance != null) {
      user.distance = req.body.distance + user.distance;
    }

    user.radius = req.body.radius || user.radius;
    user.toggleAnnotation = req.body.toggleAnnotation || user.toggleAnnotation;


    let bool;

    if (req.body.trail) {
      if (user.trailHistory.length == 0) {
        bool = false;
      } else {
        console.log(user.trailHistory.length);

        const len = user.trailHistory.length;
        for (let i = 0; i < len; i++) {
          if (user.trailHistory[i][0] == req.body.trail) {
            user.trailHistory[i][1] += 1;
            bool = true;
            break;
          }
        }
      }

      if (bool != true) {
        console.log('here');
        const tuple = [req.body.trail, 1];
        user.trailHistory.push(tuple);
      }

      if (user.trailHistory.length > 1) { sortArray(user.trailHistory); }
      user.markModified('trailHistory');
    }
    user.save();
    res.send('completed');
  }).catch((error) => {
    res.status(500).json({ error });
  });
};


// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  console.log(user);
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

// Sign in User. Auth token is sent if credentials are valid
export const signin = (req, res, next) => {
  console.log(req.body);
  return res.send({ token: tokenForUser(req.body.username) });
};

// Sign up new user
export const signup = (req, res, next) => {
  const user = new User();
  const password = req.body.password;
  const username = req.body.username;
  const radius = '5';
  const toggleAnnotation = 'true';
  const trails = [];
  console.log(req.body);


  if (!password || !username) {
    return res.status(422).send('You must provide username and password');
  }

  // search Database to see if user pre-exists
  User.findOne({ username }).then((oldUsername) => {
    if (oldUsername) {
      res.status(422).send('user already exists');
    } else {
      user.password = password;
      user.username = username;
      user.distance = 0;
      user.radius = radius;
      user.toggleAnnotation = toggleAnnotation;
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

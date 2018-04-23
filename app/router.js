import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import * as TrailController from './controllers/trail_controller';
import * as AnnotationController from './controllers/annotation_controller';
import { requireAuth, requireSignin } from './services/passport';

const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to HikAR API server');
});

// // Sign in & sign up
// router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);
//
// // Return a user's information
// router.route('/users/:userId')
//   .get(requireAuth, UserController.fetchUser)
//   .put(requireAuth, UserController.updateUser);


// Return all trails
router.route('/trails')
  .get(TrailController.getTrails);

// get trail by name
router.route('/trails/:name')
  .get(TrailController.getTrailbyName);

// query nearby trails
router.route('/query/:lat/:lon/:radius')
  .get(TrailController.queryTrails);

// get all users
router.route('/users/')
  .put(UserController.UpdateUserInfo)
  .get(UserController.getUsers);


router.route('/annotation')
  .get(AnnotationController.getAnnotations)
  .post(AnnotationController.postAnnotation);

// RESTful
//   /trails    .get
//   /annotations   .put .post .get
//   /annotations/:id
//   /users
//   /users/:id


export default router;

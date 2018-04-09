import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  username: String,
  first: String,
  last: String,
  password: { type: String, select: false },
});

UserSchema.set('toJSON', {
  virtuals: true,
});

/* Pre save hook to convert the plaintext password to the hashed password */
UserSchema.pre('save', function saveSaltAndHashPassword(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    // hash user.password with the salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      // overwrite plain text password with encrypted password
      user.password = hash;

      // allow the hook to proceed
      next();
    });
  });
});

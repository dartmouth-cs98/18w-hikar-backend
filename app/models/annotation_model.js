import mongoose, { Schema } from 'mongoose';

const Annotation = new Schema({
  type: String,
  text: String,
});

const AnnotationModel = mongoose.model('annotation', Annotation);

export default AnnotationModel;

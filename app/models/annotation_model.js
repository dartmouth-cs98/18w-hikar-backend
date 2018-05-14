import mongoose, { Schema } from 'mongoose';

const Annotation = new Schema({
  type: String,
  text: String,
  color: String,
  style: String,
  offset: String,
  lat: String,
  lon: String,
});

const AnnotationModel = mongoose.model('annotation', Annotation);

export default AnnotationModel;

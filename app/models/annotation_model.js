import mongoose, { Schema } from 'mongoose';

const Annotation = new Schema({
  type: String,
  text: String,
  font: String,
  style: String,
  lat: Number,
  lon: Number,
});

const AnnotationModel = mongoose.model('annotation', Annotation);

export default AnnotationModel;

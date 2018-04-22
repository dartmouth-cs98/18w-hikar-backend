import mongoose, { Schema } from 'mongoose';

const Geometry = new Schema({
  type: String,
  coordinates: Array,
});

const Trails = new Schema({
  name: String,
  geometry: Geometry,
});

const TrailModel = mongoose.model('trails', Trails);

export default TrailModel;

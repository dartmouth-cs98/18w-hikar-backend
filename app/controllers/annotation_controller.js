import Annotation from '../models/annotation_model';

export const postAnnotation = (req, res, next) => {
  const Ann = new Annotation();
  Ann.type = req.body.type;
  Ann.text = req.body.text;
  Ann.lat = req.body.lat;
  Ann.lon = req.body.long;
  Ann.offset = req.body.offset;
  Ann.color = req.body.color;
  Ann.style = req.body.style;
  Ann.save().then((result) => {
    res.send('annotation created');
  }).catch((error) => {
    res.status(500).json({ error });
  });
};

export const getAnnotations = (req, res, next) => {
  Annotation.find((err, result) => {
    res.send(result);
  });
};

import Annotation from '../models/annotation_model';

export const postAnnotation = (req, res, next) => {
  const node = { type: `${req.body.type}`, text: `${req.body.text}` };
  Annotation.insertOne(node, (err, res) => {
    if (err) console.log(`error occured: ${err}`);
    else console.log(`${node} successfully posted`);
  });
};

export const getAnnotations = (req, res, next) => {
  Annotation.find((err, result) => {
    res.send(result);
  });
};

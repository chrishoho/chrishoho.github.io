  /*
  variables
  */
  let model;  
  let inputImgElement = document.getElementById('input');
  let appStatusElement = document.getElementById('app-status');
  let outputElement = document.getElementById('output');
  /*
  load the model
  */
 async function start() {
   console.log("before loading: ", tf.memory());
  //load the model 
  logStatus("Loading Model...");
  const MODEL_URL = 'https://raw.githubusercontent.com/chrishoho/chrishoho.github.io/master/dataAugAOI/tfjs_json_models/shinkai/model.json';
  //const MODEL_URL = 'tfjs_json_models/shinkai/model.json';
  console.log(MODEL_URL);
  model = await tf.loadGraphModel(MODEL_URL);
  
  //warm up 
  logStatus("Model Loaded");
  console.log('warm up model');
  model.predict(tf.zeros([1, 1, 1, 3])).dispose();
};

async function predict2(imgData) {
  console.log("before predicting: ", tf.memory());

  //get the image data from the canvas 
  let inputImgTensor = tf.browser.fromPixels(imgData);
  //pre-process (resize & normalize ??)
  inputImgTensor = inputImgTensor.toFloat();
  inputImgTensor = inputImgTensor.reverse(axis=2);
  //We add a dimension to get a batch shape 
  inputImgTensor = tf.expandDims(inputImgTensor, 0);

  //get the prediction 
  logStatus("Generating images...");
  const startTime = performance.now();
  let generatedImgTensor = model.predict(inputImgTensor);
  generatedImgTensor = tf.squeeze(generatedImgTensor, 0);
  generatedImgTensor = generatedImgTensor.reverse(axis=2);
  generatedImgTensor = generatedImgTensor.mul(0.5).add(0.5);
  console.log(generatedImgTensor);
  generatedImgTensor = tf.clipByValue(generatedImgTensor, 0, 1);
  
  //renderResult(generatedImgTensor);
  logStatus("Image Generated");
  let outputElement = document.getElementById('output');
	tf.browser.toPixels(generatedImgTensor, outputElement);
  outputElement.style.display = 'inline-block';
  inputImgTensor.dispose();

  const totalTime = performance.now() - startTime;
  console.log(`Transformation done in ${Math.floor(totalTime)}ms`);
  console.log("after predicting: ", tf.memory())
};

function logStatus(message) {
  appStatusElement.textContent = message;
  appStatusElement.style.display = 'block';
};
/*
variables
*/
let model;  
let inputImgElement = document.getElementById('input');
let appStatusElement = document.getElementById('app-status');
let outputElement = document.getElementById('output');
let preOutputElement = document.getElementById('pregenerated_output');
  
function logStatus(message) {
  console.log(message);
  appStatusElement.textContent = message;
  appStatusElement.style.display = 'block';
  outputElement.style.display = 'none';
  preOutputElement.style.display = 'none';
};
  
/*
load the model
*/
 async function start() {
   
  inputImgElement = document.getElementById('input');
  appStatusElement = document.getElementById('app-status');
  outputElement = document.getElementById('output');
  preOutputElement = document.getElementById('pregenerated_output');

  console.log("before loading: ", tf.memory());
  //load the model 
  logStatus("Loading Model...");
  //const MODEL_URL = 'https://raw.githubusercontent.com/chrishoho/chrishoho.github.io/master/dataAugAOI/tfjs_json_models/shinkai/model.json';
  const MODEL_URL = 'tfjs_json_models/shinkai/model.json';
  console.log(MODEL_URL);
  model = await tf.loadGraphModel(MODEL_URL);
  
  //warm up 
  logStatus("Loading Model Completed");
  console.log('warm up model');
  model.predict(tf.zeros([1, 1, 1, 3])).dispose();
};

async function predict(imgData) {
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
  tf.browser.toPixels(generatedImgTensor, outputElement);
  preOutputElement.style.display = 'none';
  outputElement.style.display = 'inline-block';
  inputImgTensor.dispose();

  const totalTime = performance.now() - startTime;
  console.log(`Transformation done in ${Math.floor(totalTime)}ms`);
  console.log("after predicting: ", tf.memory())
};

window.onload = function () {
  'use strict';

  var Cropper = window.Cropper;
  var URL = window.URL || window.webkitURL;
  var container = document.querySelector('.img-container');
  var image = container.getElementsByTagName('img').item(0);
  var download = document.getElementById('download');
  var actions = document.getElementById('actions');
  var dataX = document.getElementById('dataX');
  var dataY = document.getElementById('dataY');
  var dataHeight = document.getElementById('dataHeight');
  var dataWidth = document.getElementById('dataWidth');
  var dataRotate = document.getElementById('dataRotate');
  var dataScaleX = document.getElementById('dataScaleX');
  var dataScaleY = document.getElementById('dataScaleY');
  // let outputElement = document.getElementById('output');
  // let preOutputElement = document.getElementById('pregenerated_output');
  // var minCroppedWidth = 16;
  // var minCroppedHeight = 16;
  // var maxCroppedWidth = 64;
  // var maxCroppedHeight = 64;
  var options = {
    aspectRatio: 128 / 32,
    //aspectRatio: 16 / 9,
    preview: '.img-preview',
    ready: function (e) {
      console.log(e.type);
    },
    cropstart: function (e) {
      console.log(e.type, e.detail.action);
    },
    cropmove: function (e) {
      console.log(e.type, e.detail.action);
    },
    cropend: function (e) {
      console.log(e.type, e.detail.action);
    },
    crop: function (e) {
      var data = e.detail;

      console.log(e.type);
	    // if (
      //   data.width < minCroppedWidth
      //   || data.height < minCroppedHeight
      //   || data.width > maxCroppedWidth
      //   || data.height > maxCroppedHeight
      // ) {
      //   cropper.setData({
      //     width: Math.max(16, Math.min(64, data.width)),
      //     height: Math.max(16, Math.min(64, data.height)),
      //   });
      // }
      dataX.value = Math.round(data.x);
      dataY.value = Math.round(data.y);
      dataHeight.value = Math.round(data.height);
      dataWidth.value = Math.round(data.width);
      dataRotate.value = typeof data.rotate !== 'undefined' ? data.rotate : '';
      dataScaleX.value = typeof data.scaleX !== 'undefined' ? data.scaleX : '';
      dataScaleY.value = typeof data.scaleY !== 'undefined' ? data.scaleY : '';
    },
    zoom: function (e) {
      console.log(e.type, e.detail.ratio);
    }
  };
  var cropper = new Cropper(image, options);
  var originalImageURL = image.src;
  var uploadedImageType = 'image/jpeg';
  var uploadedImageName = 'cropped.jpg';
  var uploadedImageURL;

  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Buttons
  if (!document.createElement('canvas').getContext) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }

  // Download
  if (typeof download.download === 'undefined') {
    download.className += ' disabled';
    download.title = 'Your browser does not support download';
  }

  // Options
  actions.querySelector('.docs-toggles').onchange = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropBoxData;
    var canvasData;
    var isCheckbox;
    var isRadio;

    if (!cropper) {
      return;
    }

    if (target.tagName.toLowerCase() === 'label') {
      target = target.querySelector('input');
    }

    isCheckbox = target.type === 'checkbox';
    isRadio = target.type === 'radio';

    if (isCheckbox || isRadio) {
      if (isCheckbox) {
        options[target.name] = target.checked;
        cropBoxData = cropper.getCropBoxData();
        canvasData = cropper.getCanvasData();

        options.ready = function () {
          console.log('ready');
          cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
        };
      } else {
        options[target.name] = target.value;
        options.ready = function () {
          console.log('ready');
        };
      }

      // Restart
      cropper.destroy();
      cropper = new Cropper(image, options);
    }
  };

  // Methods
  actions.querySelector('.docs-buttons').onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropped;
    var result;
    var input;
    var data;

    if (!cropper) {
      return;
    }

    while (target !== this) {
      if (target.getAttribute('data-method')) {
        break;
      }

      target = target.parentNode;
    }

    if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
      return;
    }

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option') || undefined,
      secondOption: target.getAttribute('data-second-option') || undefined
    };

    cropped = cropper.cropped;

    if (data.method) {
      if (typeof data.target !== 'undefined') {
        input = document.querySelector(data.target);

        if (!target.hasAttribute('data-option') && data.target && input) {
          try {
            data.option = JSON.parse(input.value);
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            cropper.clear();
          }

          break;

        case 'getCroppedCanvas':
          try {
            data.option = JSON.parse(data.option);
          } catch (e) {
            console.log(e.message);
          }

          if (uploadedImageType === 'image/jpeg') {
            if (!data.option) {
              data.option = {};
            }

            data.option.fillColor = '#fff';
          }

          break;
      }

      result = cropper[data.method](data.option, data.secondOption);

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            cropper.crop();
          }

          break;

        case 'scaleX':
        case 'scaleY':
          target.setAttribute('data-option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (result) {
            // Bootstrap's Modal
            // $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

            // if (!download.disabled) {
            //   download.download = uploadedImageName;
            //   download.href = result.toDataURL(uploadedImageType);
            // }

            //predict
            // let inputImgElement = document.getElementById('input');
            // //inputImgElement.src = 'https://raw.githubusercontent.com/chrishoho/chrishoho.github.io/master/dataAugAOI/images/xiaomi_fail.jpg';
            // //inputImgElement.onload = () => predict(inputImgElement);
            // predict(inputImgElement);
            var canvas = cropper.getCroppedCanvas();
            //result.appendChild(canvas);
            //predict2(canvas);
            predict(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height));
          }

          break;

        case 'destroy':
          cropper = null;

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            image.src = originalImageURL;
          }

          break;
      }

      if (typeof result === 'object' && result !== cropper && input) {
        try {
          input.value = JSON.stringify(result);
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  };

  document.body.onkeydown = function (event) {
    var e = event || window.event;

    if (e.target !== this || !cropper || this.scrollTop > 300) {
      return;
    }

    switch (e.keyCode) {
      case 37:
        e.preventDefault();
        cropper.move(-1, 0);
        break;

      case 38:
        e.preventDefault();
        cropper.move(0, -1);
        break;

      case 39:
        e.preventDefault();
        cropper.move(1, 0);
        break;

      case 40:
        e.preventDefault();
        cropper.move(0, 1);
        break;
    }
  };

  // Import image
  var inputImage = document.getElementById('inputImage');

  if (URL) {
    inputImage.onchange = function () {
      var files = this.files;
      var file;

      if (cropper && files && files.length) {
        file = files[0];

        if (/^image\/\w+/.test(file.type)) {
          uploadedImageType = file.type;
          uploadedImageName = file.name;

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
          }

          image.src = uploadedImageURL = URL.createObjectURL(file);
          cropper.destroy();
          cropper = new Cropper(image, options);
          inputImage.value = null;
        } else {
          window.alert('Please choose an image file.');
        }
      }
    };
  } else {
    inputImage.disabled = true;
    inputImage.parentNode.className += ' disabled';
  };
  
};

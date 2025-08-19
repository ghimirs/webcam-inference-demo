import { Roboflow } from "@roboflow/inference";

// Replace these with your Roboflow project details
const publishableKey = "emo7MRpFvllZ85GMvn7t";
const modelId = "pool_table_ball_pocket";     // e.g. "pool-balls"
const version = "5";                   // your model version number

let model;
let video;
let canvas, ctx;

async function init() {
  // Setup webcam
  video = document.getElementById("webcam");
  canvas = document.getElementById("overlay");
  ctx = canvas.getContext("2d");

  // Load model
  const rf = new Roboflow({ apiKey: publishableKey });
  model = await rf.load({ model: modelId, version });

  // Force video + canvas to 640x640
  video.width = 640;
  video.height = 640;
  canvas.width = 640;
  canvas.height = 640;

  // Start prediction loop
  requestAnimationFrame(predictFrame);
}

async function predictFrame() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    // Run inference
    const predictions = await model.detect(video, { 
      maxSize: 640   // enforce model input size
    });

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw boxes
    predictions.forEach(pred => {
      const [x, y, w, h] = pred.bbox; // [centerX, centerY, width, height]

      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - w/2, y - h/2, w, h);

      ctx.fillStyle = "lime";
      ctx.font = "14px Arial";
      ctx.fillText(`${pred.class} (${(pred.confidence*100).toFixed(1)}%)`, x - w/2, y - h/2 - 5);
    });
  }

  // Keep looping
  requestAnimationFrame(predictFrame);
}

window.onload = init;

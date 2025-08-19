import { Roboflow } from "@roboflow/inference";

// Replace these with your Roboflow project details
const publishableKey = "emo7MRpFvllZ85GMvn7t";
const modelId = "pool_table_ball_pocket";     // e.g. "pool-balls"
const version = "5";                   // your model version number

// main.js (no import version, works with Roboflow CDN)

const apiKey = "emo7MRpFvllZ85GMvn7t";   // <-- replace with your Roboflow Publishable Key
const modelId = "pool_table_ball_pocket/5";  // <-- replace with your model + version (e.g., "pool-detect/3")

// Setup video
const video = document.createElement("video");
video.autoplay = true;
video.playsInline = true;
video.style.display = "none"; // keep hidden, we’ll draw to canvas instead
document.body.appendChild(video);

// Setup canvas
const canvas = document.createElement("canvas");
canvas.width = 640;
canvas.height = 640;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// Start webcam
navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 640 } })
  .then(stream => { video.srcObject = stream; })
  .catch(err => console.error("Camera error:", err));

async function run() {
  // Load model
  const model = await window.roboflow
    .auth({ publishable_key: apiKey })
    .load({ model: modelId });

  async function detectFrame() {
    const predictions = await model.detect(video);

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw predictions
    predictions.forEach(pred => {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        pred.bbox.x - pred.bbox.width / 2,
        pred.bbox.y - pred.bbox.height / 2,
        pred.bbox.width,
        pred.bbox.height
      );

      ctx.fillStyle = "red";
      ctx.font = "16px Arial";
      ctx.fillText(
        `${pred.class} (${Math.round(pred.confidence * 100)}%)`,
        pred.bbox.x - pred.bbox.width / 2,
        pred.bbox.y - pred.bbox.height / 2 - 5
      );
    });

    requestAnimationFrame(detectFrame);
  }

  detectFrame();
}

run();

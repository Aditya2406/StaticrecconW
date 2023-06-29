const Stream = require("node-rtsp-stream");

// Create a new RTSP stream instance
const stream = new Stream({
  name: "rtsp-stream",
  streamUrl: "rtsp://13.234.211.133:8554/Cam/name", // Replace with your RTSP stream URL
  wsPort: 9999, // WebSocket port
  ffmpegOptions: {
    "-stats": "",
    "-r": 30, // Frame rate (adjust as needed)
  },
});

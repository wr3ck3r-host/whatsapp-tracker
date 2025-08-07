console.log("Starting ...");

require("./lib/config");
require("./lib/array");

if (!global.config.dbpath) global.config.dbpath = __dirname + "/json.sqlite";

const startClient = require("./client");
const startServer = require("./server");

Promise.all([startClient, startServer])
  .then(() => {
    console.log("Client and Server started successfully.");

    // Prevent the app from exiting
    setInterval(() => {}, 1000 * 60 * 60); // keeps it alive every hour
  })
  .catch((err) => {
    console.error("Startup failed:", err);
    process.exit(1);
  });

process.on("uncaughtException", (error) => {
	console.error("Uncaught Exception:", error);
	process.exit(1);
});
process.on("unhandledRejection", (error) => {
	console.error("Unhandled Rejection:", error);
	process.exit(1);
});

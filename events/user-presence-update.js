require('dotenv').config();
const db = require("quick.db");
const webpush = require("web-push");

// Set up VAPID details using environment variables
webpush.setVapidDetails(
  'mailto:your@email.com', // You can replace this with your email or leave it
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/**
 * @param {import('@adiwajshing/baileys').WAConnection} client
 * @param {import('@adiwajshing/baileys').PresenceUpdate} update
 */
module.exports = async (client, update) => {
  try {
    const id = update.id.replace(/\D/g, "");
    const presences = db.get(`presence.${id}`);
    let status = "";

    if (!presences) return; // user presence doesn't exist

    if (update.type === "available") {
      status = "online";
      if (presences.last && presences.last.to === presences.last.from) {
        return; // already marked as online, skip
      }
      presences.push({ from: Date.now(), to: Date.now() });
    } else if (update.type === "unavailable") {
      status = "offline";
      if (presences.last && presences.last.to === presences.last.from) {
        presences.last.to = Date.now();
      } else {
        return; // no matching online event
      }
    } else {
      return;
    }

    db.set(`presence.${id}`, presences);

    // Optional: send push notification here if needed
    // webpush.sendNotification(...)

  } catch (err) {
    console.error("Error handling presence update:", err);
  }
};

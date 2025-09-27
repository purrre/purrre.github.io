// typing
const texts = [
  "Python Developer",
  "999 Forever",
  "Lua Developer",
  "999 Enthusiast",
  "JavaScript Developer",
  "🎵 Feel like cosby wit that molly",
  "Developer",
  "WRLD Enthusiast",
  "💖💖💖💖",
  "Bot Developer",
  "Full Stack Developer (somewhat)",
  "AI Experimentist"
];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";
const typingEl = document.getElementById("typing");

function type() {
  if (count === texts.length) count = 0;
  currentText = texts[count];
  letter = currentText.slice(0, ++index);

  typingEl.textContent = letter;
  if (letter.length === currentText.length) {
    setTimeout(() => {
      index = 0;
      count++;
      setTimeout(type, 500);
    }, 1500);
  } else {
    setTimeout(type, 120);
  }
}
type();

// discord
const ID = "527172619514937354"; 
const API_URL = `https://api.lanyard.rest/v1/users/${ID}`;

async function fetchDiscord() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    if (!data.success) return;

    const d = data.data;
    const avatarURL = d.discord_user.avatar 
      ? `https://cdn.discordapp.com/avatars/${ID}/${d.discord_user.avatar}.png?size=128`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    document.getElementById("discord-avatar").src = avatarURL;
    document.getElementById("discord-name").textContent = d.discord_user.username;

    const statusEl = document.getElementById("discord-status");
    statusEl.className = `status ${d.discord_status}`;

    const activityEl = document.getElementById("discord-activity");
    if (d.activities && d.activities.length > 0) {
      const activity = d.activities[0];
      const activityText = activity.name;
      let activityPrefix = "Listening to";
      
      if (activity.type === 2) {
        activityPrefix = "Listening to";
      } else if (activity.type === 0) {
        activityPrefix = "Playing";
      } else if (activity.type === 3) {
        activityPrefix = "Watching";
      } else if (activity.type === 1) {
        activityPrefix = "Streaming";
      }
      
      activityEl.textContent = `${activityPrefix} ${activityText}`;
    } else {
      activityEl.textContent = "Idling";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("discord-name").textContent = "purree";
    document.getElementById("discord-status").className = "status offline";
    document.getElementById("discord-activity").textContent = "Idling";
  }
}

fetchDiscord();
setInterval(fetchDiscord, 15000);
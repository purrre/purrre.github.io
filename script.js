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
    document.getElementById("discord-name").textContent =
      d.discord_user.username;

    const statusMap = {
      online: "🟢",
      idle: "🌙",
      dnd: "⛔",
      offline: "⚫"
    };
    document.getElementById("discord-status").textContent =
      statusMap[d.discord_status] || d.discord_status;

    const activity = d.activities && d.activities.length > 0 ? d.activities[0].name : "None";
    document.getElementById("discord-activity").textContent = "Activity: " + activity;
  } catch (err) {
    console.error("Error fetching Discord data:", err);
  }
}

fetchDiscord();
setInterval(fetchDiscord, 15000);
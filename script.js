const DISCORD_ID = "527172619514937354"; 
const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;
const TYPING_SPEED = 120;
const DELETE_PAUSE = 1500;
const DISCORD_REFRESH = 15000;

const TYPING_TEXTS = [
    "Python Developer",
    "999 Forever",
    "Lua Developer",
    "Rest APIs 😍",
    "JavaScript Developer",
    "🎵 Feel like cosby wit that molly",
    "Developer",
    "WRLD Enthusiast",
    "💖💖💖💖",
    "Bot Developer",
    "Full Stack Developer (somewhat)",
    "Automation Expert",
    "AI Manipulation"
];

const STATUS_COLORS = {
    'online': 'bg-green-500',
    'idle': 'bg-yellow-500',
    'dnd': 'bg-red-500',
    'offline': 'bg-gray-500'
};

const ACTIVITY_TYPES = {
    0: "Playing",
    1: "Streaming",
    2: "Listening to",
    3: "Watching",
    4: "Custom Status",
    5: "Competing in"
};

// typer
function startTypingEffect() {
    let textIndex = 0;
    let charIndex = 0;
    const typingEl = document.getElementById("typing");

    function type() {
        if (textIndex >= TYPING_TEXTS.length) {
            textIndex = 0;
        }

        const currentText = TYPING_TEXTS[textIndex];
        
        typingEl.textContent = currentText.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex <= currentText.length) {
            setTimeout(type, TYPING_SPEED);
        } else {
            setTimeout(erase, DELETE_PAUSE);
        }
    }

    function erase() {
        const currentText = TYPING_TEXTS[textIndex];
        
        typingEl.textContent = currentText.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex > 0) {
            setTimeout(erase, TYPING_SPEED / 2);
        } else {
            textIndex++;
            setTimeout(type, 500);
        }
    }

    type();
}

// stars (shoutout whoever on stackoverflow made the general logic)
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = Array.from({length: 150}, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5 + 0.5,
  dx: (Math.random() - 0.5) * 0.3,
  dy: (Math.random() - 0.5) * 0.3
}));

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
    s.x += s.dx;
    s.y += s.dy;
    if(s.x < 0) s.x = canvas.width;
    if(s.x > canvas.width) s.x = 0;
    if(s.y < 0) s.y = canvas.height;
    if(s.y > canvas.height) s.y = 0;
  });
  requestAnimationFrame(animateStars);
}
animateStars();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// discord card
async function fetchDiscordStatus() {
    try {
        const res = await fetch(LANYARD_API);
        const json = await res.json();

        if (!json.success || !json.data) {
            console.warn("Lanyard API call failed or returned no data.");
            updateDiscordUI({ discord_status: 'offline', discord_user: { username: "purree" } });
            return;
        }

        updateDiscordUI(json.data);

    } catch (err) {
        console.error("Error fetching Discord status:", err);
        updateDiscordUI({ discord_status: 'offline', discord_user: { username: "purree" } });
    }
}

function updateDiscordUI(d) {
    const avatarEl = document.getElementById("discord-avatar");
    const nameEl = document.getElementById("discord-name");
    const statusEl = document.getElementById("discord-status");
    const activityEl = document.getElementById("discord-activity");
    const avatarHash = d.discord_user.avatar;
    const userID = d.discord_user.id || DISCORD_ID;
    
    const avatarURL = avatarHash
        ? `https://cdn.discordapp.com/avatars/${userID}/${avatarHash}.png?size=128`
        : `https://cdn.discordapp.com/embed/avatars/${(d.discord_user.discriminator % 5)}.png`;

    avatarEl.src = avatarURL;
    nameEl.textContent = d.discord_user.display_name || d.discord_user.username || "purree";
    const status = d.discord_status;
    const colorClass = STATUS_COLORS[status] || STATUS_COLORS.offline;
    
    statusEl.className = statusEl.className
        .split(' ')
        .filter(cls => !cls.startsWith('bg-') && !cls.startsWith('status'))
        .join(' ');
    
    statusEl.classList.add('status', colorClass); // Assuming 'status' provides the base styling (size, border)
    statusEl.title = status.toUpperCase();


    const activity = (d.activities && d.activities.length > 0) ? d.activities[0] : null;

    if (activity) {
        const activityText = activity.name;
        const activityPrefix = ACTIVITY_TYPES[activity.type] || "Activity";
        activityEl.textContent = `${activityPrefix} ${activityText}`;
    } else {
        activityEl.textContent = "Idling";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    startTypingEffect();
    fetchDiscordStatus();
    setInterval(fetchDiscordStatus, DISCORD_REFRESH);
});
const canvas = document.getElementById("preview");
const ctx = canvas.getContext("2d");

let selectedImg = null;
let imageLoaded = false;

// ---------- IMAGE LOAD ----------
function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(selectedImg, 0, 0, canvas.width, canvas.height);
}

function selectTemplate(img) {
    selectedImg = new Image();
    imageLoaded = false;

    selectedImg.onload = function () {
        imageLoaded = true;
        drawImage();
    };
    selectedImg.src = img.src;
}

function uploadImage(event) {
    const reader = new FileReader();
    selectedImg = new Image();
    imageLoaded = false;

    reader.onload = function (e) {
        selectedImg.onload = function () {
            imageLoaded = true;
            drawImage();
        };
        selectedImg.src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

// ---------- AI CAPTION (RULE BASED) ----------
function generateAICaption() {
    if (!imageLoaded) {
        alert("Select image first");
        return;
    }

    const input = document.getElementById("userInput").value.toLowerCase();
    let captions = [];

    if (input.includes("college") || input.includes("fest")) {
        captions = [
            "Memories that last forever 🎓",
            "College days, best days ✨",
            "Moments that turn into memories 💙"
        ];
    } 
    else if (input.includes("exam")) {
        captions = [
            "Exam mode ON 😵",
            "Study hard, panic harder 😄",
            "Dear syllabus, be kind 🙏"
        ];
    } 
    else {
        captions = [
            "Creativity in action ✨",
            "Designed with smart ideas 💡",
            "Making moments memorable 😎"
        ];
    }

    const caption = captions[Math.floor(Math.random() * captions.length)];
    drawText(caption);
}

// ---------- USER TEXT ----------
function addMyText() {
    if (!imageLoaded) {
        alert("Select image first");
        return;
    }
    drawText(document.getElementById("userInput").value);
}

// ---------- DRAW TEXT ----------
function drawText(text) {
    drawImage();

    const pos = document.getElementById("textPosition").value;
    const font = document.getElementById("fontStyle").value;
    const color = document.getElementById("textColor").value;

    ctx.font = font;
    ctx.fillStyle = color;

    let y = pos === "top" ? 30 : pos === "center" ? canvas.height / 2 : canvas.height - 20;
    ctx.fillText(text, 10, y);
}

// ---------- SAVE IMAGE ----------
function saveImage() {
    localStorage.setItem("finalImage", canvas.toDataURL("image/png"));
}
async function callAICaption(prompt) {
  try {
    const res = await fetch("http://localhost:3000/generate-caption", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    return data.caption;
  } catch (err) {
    console.error("AI caption error:", err);
    return null;
  }
}

async function generateAICaption() {
  if (!imageLoaded) {
    alert("Select image first");
    return;
  }

  const prompt = document.getElementById("userInput").value;
  const caption = await callAICaption(prompt);

  if (caption) {
    drawText(caption);
  }
}
async function callAIImage(prompt) {
  try {
    const res = await fetch("http://localhost:3000/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    return data.imageUrl;
  } catch (err) {
    console.error("AI image error:", err);
    return null;
  }
}

async function generateAIImage() {
  const prompt = document.getElementById("userInput").value;
  const url = await callAIImage(prompt);

  if (url) {
    selectedImg = new Image();
    selectedImg.onload = () => {
      imageLoaded = true;
      drawImage();
    };
    selectedImg.src = url;
  }
}

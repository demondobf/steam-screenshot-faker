const canvasFull = document.querySelector("#canvas-full");
const canvasThumbnail = document.querySelector("#canvas-thumbnail");

function drawImage(img, canvas) {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
}

function drawImageScaled(img, canvas) {
  const ctx = canvas.getContext("2d");

  const horizontalRatio = canvas.width / img.width;
  const verticalRatio = canvas.height / img.height;
  const ratio = Math.min(horizontalRatio, verticalRatio);

  const centerShiftX = (canvas.width - img.width * ratio) / 2;
  const centerShiftY = (canvas.height - img.height * ratio) / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
}

function generateScreenshotName(version) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  return `${version} - ${year}${month}${day}${hours}${minutes}${seconds}_1`;
}

document.querySelector("#upload-input").addEventListener("change", (event) => {
  const img = new Image();

  img.onload = () => {
    canvasFull.width = img.width;
    canvasFull.height = img.height;

    drawImage(img, canvasFull);
    drawImageScaled(img, canvasThumbnail);
  };

  img.src = URL.createObjectURL(event.target.files[0]);
});

document.querySelector("#download-button").addEventListener("click", () => {
  for (const canvas of [canvasFull, canvasThumbnail]) {
    const canvasUrl = canvas.toDataURL("image/jpeg", 1);
    const anchor = document.createElement("a");

    anchor.href = canvasUrl;
    anchor.download = generateScreenshotName(canvas.dataset.version);
    anchor.click();
    anchor.remove();
  }
});

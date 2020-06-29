const size = document.querySelector('.size');
const scale = document.querySelector('.scale');
const video = document.querySelector('.webcam');
const canvas = document.querySelector('.video');
const ctx = canvas.getContext('2d');
const faceCanvas = document.querySelector('.face');
const faceCtx = faceCanvas.getContext('2d');
const faceDetector = new window.FaceDetector();
// console.log(size, scale, webcam, video, face, faceDetector);

const options = {
    SIZE: 10,
    SCALE: 1.5,
};

async function populateVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 2340, height: 1080 },
    });
    video.srcObject = stream;
    await video.play();
    console.log(video.videoWidth, video.videoHeight);
    canvas.width = video.videoWidth;
    faceCanvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    faceCanvas.height = video.videoHeight;
}

async function detectFace() {
    const faces = await faceDetector.detect(video);
    // console.log(faces.length);
    // faces.forEach(drawFace);
    faces.forEach(pixelate);
    // run detect every next animation frame
    requestAnimationFrame(detectFace);
}

function drawFace(face) {
    // console.log(face);
    const { width, height, top, left } = face.boundingBox;
    // console.log({ width, height, top, left });
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas so we always have one rect
    ctx.strokeStyle = '#ffc600';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        left - (face.width * SCALE - face.width) / SCALE,
        top - (face.height * SCALE - face.height) / SCALE,
        width * SCALE,
        height * SCALE
    );
}

function pixelate({ boundingBox: face }) {
    faceCtx.imageSmoothingEnabled = false;
    // console.log(face);
    // making rectangle super small
    faceCtx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas so we always have one rect
    faceCtx.lineWidth = 2;
    faceCtx.drawImage(
        // source args
        video, // source of image we want to draw
        face.x, // where the image starts (x,y) = top left corner
        face.y,
        face.width, // from (x,y) to fill the full rect
        face.height,
        // draw args
        face.x, // where should we draw? same place but pixelated
        face.y,
        options.SIZE,
        options.SIZE
    );

    const width = face.width * options.SCALE;
    const height = face.height * options.SCALE;
    // making that small rectangle, real size. it will be pixelated
    faceCtx.drawImage(
        faceCanvas,
        face.x,
        face.y,
        options.SIZE,
        options.SIZE,
        face.x - (width - face.width) / options.SCALE,
        face.y - (height - face.height) / options.SCALE,
        width,
        height
    );
}

populateVideo().then(detectFace);

size.addEventListener('input', handleSizeInput);
scale.addEventListener('input', handleScaleInput);

function handleSizeInput() {
    options.SIZE = size.value;
}

function handleScaleInput() {
    options.SCALE = scale.value;
}
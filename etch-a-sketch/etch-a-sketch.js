console.log('it works!');
const MOVE_AMOUNT = 20;
let lineColour = 0;
let color = `hsl(0, 100%, 50%)`;

// ················ //
// SELECTORS
const canvas = document.querySelector('#etch-a-sketch');
canvas.classList.add('shake');
const ctx = canvas.getContext('2d');
const shakeBtn = document.querySelector('.shake');

// ················ //
// USEFULL FUNCTIONS
const { width, height } = canvas;

function startNewCanva() {
  const initialX = Math.floor(Math.random() * width) - 30;
  const initialY = Math.floor(Math.random() * height) - 30;

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = '30';

  ctx.beginPath(); // start the drawing
  ctx.strokeStyle = giveMeAColour();
  ctx.moveTo(initialX, initialY);
  ctx.lineTo(initialX, initialY);
  ctx.stroke();

  return { initialX, initialY };
}

// ················ //
let newPosition = startNewCanva();
const actualPosition = {
  actualX: newPosition.initialX,
  actualY: newPosition.initialY
};

function giveMeAColour() {
  lineColour += 5;
  color = `hsl(${lineColour},100%,50%)`;
  return color;
}

// eslint-disable-next-line no-shadow
function draw({ key }) {
  ctx.beginPath(); // start the drawing
  ctx.moveTo(newPosition.initialX, newPosition.initialY);

  switch (key) {
    case 'ArrowUp':
      actualPosition.actualY -= MOVE_AMOUNT;
      newPosition.initialY = actualPosition.actualY;
      break;
    case 'ArrowRight':
      actualPosition.actualX += MOVE_AMOUNT;
      newPosition.initialX = actualPosition.actualX;
      break;
    case 'ArrowDown':
      actualPosition.actualY += MOVE_AMOUNT;
      newPosition.initialY = actualPosition.actualY;
      break;
    case 'ArrowLeft':
      actualPosition.actualX -= MOVE_AMOUNT;
      newPosition.initialX = actualPosition.actualX;
      break;
    default:
      break;
  }

  ctx.strokeStyle = giveMeAColour();
  ctx.lineTo(actualPosition.actualX, actualPosition.actualY);
  ctx.stroke();
}

// ················ //
// HANDLERS
function handleKey(event) {
  if (event.keyCode >= 37 && event.keyCode <= 40) {
    event.preventDefault();
    draw({ key: event.key });
  }
  /*
  El prevent default nos permite decirle a las flechas que lleguen
  hasta aca y no sigan ejecutando las funciones que vienen aparejadas al evento. En este caso queremos que las flechas no nos muevan el window para arriba o abajo que es una funcion que viene aparejada con dicho evento, asi que llega hasta aca, ejecuta la funcion del handler y corta ahi
  */
}

function handleShakeClick(event) {
  console.log(event);
  ctx.clearRect(0, 0, width, height);
  newPosition = startNewCanva();
  actualPosition.actualX = newPosition.initialX;
  actualPosition.actualY = newPosition.initialY;
}

// ················ //
// LISTENERS
shakeBtn.addEventListener('click', handleShakeClick);
window.addEventListener('keydown', handleKey);

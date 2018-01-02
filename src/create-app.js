import createEyeView from "./eye-view";
import createEngine from "./engine";

// define bleeding in area of interaction
const MARGIN_TOP = 90;
const MARGIN_BOTTOM = 100;
const MARGIN_LEFT = 200;
const MARGIN_RIGHT = 200;
let MIN_Y;
let MAX_Y;
let MIN_X;
let MAX_X;

const EyeProps = {
  target: "face",
  size: 96,
  top: 114,
  eyeColor: "#e6e7e7",
  irisColor: "#a6a8ab",
  position: "absolute",
  leftEyeName: "left-eye",
  leftEyeMargin: 62,
  rightEyeName: "right-eye",
  rightEyeMargin: 251,
  zIndex: -1
};

function initializeView(root) {
  const faceDiv = document.createElement("div");
  const rootDiv = document.getElementById(root);
  faceDiv.id = "face";
  faceDiv.className = "face";
  rootDiv.innerHTML = "";
  rootDiv.appendChild(faceDiv);

  const navLink = document.getElementById("nav-links").getBoundingClientRect();
  const face = document.getElementById("face").getBoundingClientRect();

  MIN_Y = face.top - MARGIN_TOP;
  MAX_Y = navLink.bottom + MARGIN_BOTTOM;
  MIN_X = face.left - MARGIN_LEFT;
  MAX_X = face.right + MARGIN_RIGHT;
}

function shouldLook(mouseX, mouseY) {
  return (
    mouseY >= MIN_Y && mouseY <= MAX_Y && mouseX >= MIN_X && mouseX <= MAX_X
  );
}

function createEyes(props) {
  return [
    createEyeView({
      target: props.target,
      name: props.leftEyeName,
      size: props.size,
      irisColor: props.irisColor,
      eyeColor: props.eyeColor,
      style: {
        position: props.position,
        top: props.top,
        marginLeft: props.leftEyeMargin,
        zIndex: props.zIndex
      }
    }),
    createEyeView({
      target: props.target,
      name: props.rightEyeName,
      size: props.size,
      irisColor: props.irisColor,
      eyeColor: props.eyeColor,
      style: {
        position: props.position,
        top: props.top,
        marginLeft: props.rightEyeMargin,
        zIndex: props.zIndex
      }
    })
  ];
}

function createApp(root) {
  initializeView(root);
  const eyes = createEyes(EyeProps);
  eyes.forEach(eye => eye.display());
  createEngine({
    onMouseChange: ({ mouseX, mouseY }) =>
      shouldLook(mouseX, mouseY)
        ? eyes.forEach(eye => eye.update(mouseX, mouseY))
        : eyes.forEach(eye => eye.resetPosition()),
    onMouseStop: () => eyes.forEach(eye => eye.resetPosition())
  }).start();
}

export default createApp;

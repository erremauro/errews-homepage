import createEyeView from "./eye-view";
import createEngine from "./engine";

// define area of interaction
const MIN_Y = 20;
const MAX_Y = 500;
const MIN_X = 200;
const MAX_X = 1050;

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

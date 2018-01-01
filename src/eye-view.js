class EyeView {
  static defaultProps = {
    irisColor: "#ddd",
    eyeColor: "#fff",
    pupilColor: "#000"
  };

  state = {
    pupilX: 0,
    pupilY: 0
  };

  constructor(props) {
    this.props = Object.assign({}, EyeView.defaultProps, props);
    this.props.style = this._prepareStyle(this.props.style);
    this.viewWidth = props.size;
    this.viewHeight = props.size;
    this.viewCenterX = props.size / 2;
    this.viewCenterY = props.size / 2;
    this.radius = props.size / 2;
    this.canvas = this._createCanvas();
    this.context = this.canvas.getContext("2d");
    this.centerX = this.canvas.offsetLeft + this.canvas.width / 2;
    this.centerY = this.canvas.offsetTop + this.canvas.height / 2;
  }

  update(mouseX, mouseY) {
    let dx = mouseX - this.centerX;
    let dy = mouseY - this.centerY;
    let c = Math.sqrt(dx * dx + dy * dy);
    let r = this.radius / 2.3;

    if (Math.abs(dx) < r && Math.abs(dy) < r && c < r) r = c;
    const alfa = Math.asin(dy / c);

    this._updateState({
      pupilX: dx < 0 ? Math.cos(alfa) * r * -1 : Math.cos(alfa) * r,
      pupilY: Math.sin(alfa) * r
    });
  }

  display() {
    this.context.clearRect(0, 0, this.viewWidth, this.viewHeight);
    this._draw();
    requestAnimationFrame(this.display.bind(this));
  }

  resetPosition() {
    this._updateState({
      pupilX: 0,
      pupilY: 0
    });
  }

  _updateState(newState) {
    this.state = Object.assign(this.state, newState);
  }

  _prepareStyle(style) {
    return Object.keys(style).reduce((obj, key) => {
      if (key === "zIndex") return obj;
      obj[key] = isNaN(style[key]) ? style[key] : style[key] + "px";
      return obj;
    }, style);
  }

  _createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.name = this.props.name;
    canvas.width = this.viewWidth;
    canvas.height = this.viewHeight;
    Object.assign(canvas.style, this.props.style);
    const target = this.props.target
      ? document.getElementById(this.props.target)
      : document.getElementsByTagName("body")[0];
    target.appendChild(canvas);
    return canvas;
  }

  _draw() {
    // clip the eye
    this.context.save();
    this.context.beginPath();
    this.context.arc(
      this.viewCenterX,
      this.viewCenterY,
      this.radius,
      0,
      Math.PI * 2
    );
    this.context.clip();

    // draw the eye
    this.context.beginPath();
    this.context.arc(
      this.viewCenterX,
      this.viewCenterY,
      this.radius,
      0,
      Math.PI * 2
    );
    this.context.fillStyle = this.props.eyeColor;
    this.context.fill();
    this.context.closePath();

    // draw the iris
    this.context.beginPath();
    this.context.arc(
      this.viewCenterX + this.state.pupilX,
      this.viewCenterY + this.state.pupilY,
      this.radius / 1.9,
      0,
      Math.PI * 2
    );
    this.context.fillStyle = this.props.irisColor;
    this.context.fill();
    this.context.closePath();

    // draw the pupil
    this.context.beginPath();
    this.context.arc(
      this.viewCenterX + this.state.pupilX,
      this.viewCenterY + this.state.pupilY,
      this.radius / 4,
      0,
      Math.PI * 2
    );
    this.context.fillStyle = this.props.pupilColor;
    this.context.fill();
    this.context.closePath();

    this.context.restore();
  }
}

export default props => new EyeView(props);

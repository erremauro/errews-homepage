import noop from "./noop";

class Engine {
  static defaultProps = {
    onMouseStopTimeout: 2000,
    onMouseChange: noop,
    onMouseStop: noop
  };

  state = {
    isMoving: false,
    started: false
  };

  onMouseStopTimeoutId = null;

  constructor(props) {
    this.props = Object.assign({}, Engine.defaultProps, props);
    this.tickId = null;
  }

  start() {
    window.onmousemove = event => this._handleMouseMove(event);
    this.state.started = true;
  }

  stop() {
    this.state.started = false;
    this.state.isMoving = false;
    window.onmousemove = noop;
  }

  _handleMouseMove(event) {
    this.state.isMoving = true;
    this.state.mouseX = event.x;
    this.state.mouseY = event.y;
    this.props.onMouseChange(this.state);

    this.state.isMoving = false;
    if (this.onMouseStopTimeoutId) clearTimeout(this.onMouseStopTimeoutId);
    this.onMouseStopTimeoutId = setTimeout(() => {
      if (!this.state.isMoving) this.props.onMouseStop();
    }, this.props.onMouseStopTimeout);
  }
}

export default props => new Engine(props);

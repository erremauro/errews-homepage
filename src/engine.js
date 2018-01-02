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
  }

  start() {
    window.onmousemove = event => this._handleMovement(event);
    window.ontouchmove = event => this._handleMovement(event);
    this._setState({ started: true });
  }

  stop() {
    this._setState({ started: false, isMoving: false });
    window.onmousemove = noop;
    window.ontouchmove = noop;
  }

  _setState(newState) {
    this.state = Object.assign(this.state, newState);
  }

  _handleMovement(event) {
    this._setState({ isMoving: true });

    let mouseX, mouseY;
    if (event.touches) {
      mouseX = event.touches[0].clientX;
      mouseY = event.touches[0].clientY;
    } else {
      mouseX = event.x;
      mouseY = event.y;
    }

    this._setState({ mouseX, mouseY });
    this.props.onMouseChange(this.state);

    this._setState({ isMoving: false });
    this._handleMovementStopped();
  }

  _handleMovementStopped() {
    if (this.onMouseStopTimeoutId) clearTimeout(this.onMouseStopTimeoutId);
    this.onMouseStopTimeoutId = setTimeout(() => {
      if (!this.state.isMoving) this.props.onMouseStop();
    }, this.props.onMouseStopTimeout);
  }
}

export default props => new Engine(props);

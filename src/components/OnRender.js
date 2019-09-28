import { Component } from "react";
import { func, node } from "prop-types";

class OnRender extends Component {
  componentDidMount = () => this.performAction();

  componentDidUpdate = () => this.performAction();

  performAction = () => {
    const { action } = this.props;
    action();
  };

  render() {
    const { children } = this.props;
    return children;
  }
}

OnRender.defaultProps = {
  children: null
};

OnRender.propTypes = {
  action: func.isRequired,
  children: node
};

export default OnRender;

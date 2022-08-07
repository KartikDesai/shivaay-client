import React, {Component} from 'react';
import classNames from 'classnames';
import CloseIcon from 'mdi-react/CloseIcon';
import ToggleTopMenu from "./ToggleTopMenu";
const settings = `${process.env.PUBLIC_URL}/img/settings.svg`;

export default class Customizer extends Component {

  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  render() {
    const { open } = this.state;
    const customizerClass = classNames({
      customizer__wrap: true,
      'customizer__wrap--open': open,
    });

    const {
      customizer,
      toggleTopNavigation,
    } = this.props;

    return (
      <div className="customizer">
        <button className="customizer__btn" type="button" onClick={this.handleOpen}>
          <img className="customizer__btn-icon" src={settings} alt="icon" />
        </button>
        <div className={customizerClass} hidden={!open}>
          <div className="customizer__title-wrap">
            <h5>Theme Customizer</h5>
            <button className="customizer__close-btn" type="button" onClick={this.handleOpen}>
              <CloseIcon />
            </button>
          </div>
          <p className="customizer__caption">This customizer allows you to see the different variations of the Shivaay.
            Create your own visual style for every project you do!
          </p>
          <ToggleTopMenu toggleTopNavigation={toggleTopNavigation} customizer={customizer} />
        </div>
      </div>
    );
  }
}

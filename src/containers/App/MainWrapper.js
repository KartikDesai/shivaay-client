import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

class MainWrapper extends PureComponent {

  render() {
    const {
      theme, customizer, children, rtl, location,
    } = this.props;

    const wrapperClass = classNames({
      wrapper: true,
      'squared-corner-theme': customizer.squaredCorners,
      'blocks-with-shadow-theme': customizer.withBoxShadow,
      'top-navigation': customizer.topNavigation,
    });

    const direction = location.pathname === '/' ? 'ltr' : rtl.direction;

    return (
      <div className={`${theme.className} ${direction}-support`} dir={direction}>
        <div className={wrapperClass}>
          {children}
        </div>
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  theme: state.theme,
  rtl: state.rtl,
  customizer: state.customizer,
}))(MainWrapper));

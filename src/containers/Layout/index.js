/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { changeMobileSidebarVisibility, changeSidebarVisibility } from '../../redux/actions/sidebarActions';
import {
  changeThemeToLight
} from '../../redux/actions/themeActions';
import {
  changeDirectionToLTR,
} from '../../redux/actions/rtlActions';

import { changeBorderRadius, toggleBoxShadow, toggleTopNavigation } from '../../redux/actions/customizerActions';
import Topbar from "./topbar/Topbar";

import Sidebar from './sidebar/Sidebar';

class Layout extends Component {

  changeSidebarVisibility = () => {
    const { dispatch } = this.props;
    dispatch(changeSidebarVisibility());
  };

  changeMobileSidebarVisibility = () => {
    const { dispatch } = this.props;
    dispatch(changeMobileSidebarVisibility());
  };

  changeToLight = () => {
    const { dispatch } = this.props;
    dispatch(changeThemeToLight());
  };

  changeToLTR = () => {
    const { dispatch } = this.props;
    dispatch(changeDirectionToLTR());
  };

  toggleTopNavigation = () => {
    const { dispatch } = this.props;
    dispatch(toggleTopNavigation());
  };

  changeBorderRadius = () => {
    const { dispatch } = this.props;
    dispatch(changeBorderRadius());
  };

  toggleBoxShadow = () => {
    const { dispatch } = this.props;
    dispatch(toggleBoxShadow());
  };

  render() {
    const {
      customizer, sidebar, user
    } = this.props;
    const layoutClass = classNames({
      layout: true,
      'layout--collapse': sidebar.collapse,
      'layout--top-navigation': customizer.topNavigation,
    });

    return (
      <div className={layoutClass}>
        <Topbar
            changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
            changeSidebarVisibility={this.changeSidebarVisibility}
            user={user}
        />
        <Sidebar
            sidebar={sidebar}
            changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
        />
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  customizer: state.customizer,
  sidebar: state.sidebar,
  theme: state.theme,
  rtl: state.rtl,
  user: state.user,
}))(Layout));

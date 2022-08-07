import React, { Component } from 'react';
import SidebarLink from './SidebarLink';

class SidebarContent extends Component {
  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          <SidebarLink title="Dashboard" icon="home" route="/" onClick={this.hideSidebar} />
        </ul>
        <ul className="sidebar__block">
          <SidebarLink title="Log Out" icon="exit" route="/logout" />
        </ul>
      </div>
    );
  }
}

export default SidebarContent;

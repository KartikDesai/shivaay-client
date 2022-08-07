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
          {/*<SidebarLink title="Dashboard" icon="home" exact route="/"  />*/}
          <SidebarLink title="Appointments" icon="users" route="/appointments" />          
          <SidebarLink title="Add Doctor" icon="users" route="/admin/doctor" />
        </ul>
        <ul className="sidebar__block">
          <SidebarLink title="Log Out" icon="exit" route="/logout" />
        </ul>
      </div>
    );
  }
}

export default SidebarContent;

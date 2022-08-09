import React, { Component } from 'react';
import SidebarLink from './SidebarLink';
import SidebarCategory from "./SidebarCategory";

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
            <SidebarCategory title="Admin" icon="user">
                <SidebarLink title="Configure Doctor" route="/admin/doctor" />
                <SidebarLink title="Configure Chief Complaints" route="/lock_screen" />
                <SidebarLink title="Configure Drugs" route="/log_in_photo" />
            </SidebarCategory>
        </ul>
        <ul className="sidebar__block">
            <SidebarLink title="Log Out" icon="exit" route="/logout" />
        </ul>
      </div>
    );
  }
}

export default SidebarContent;

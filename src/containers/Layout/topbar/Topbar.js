import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from "./TopbarProfile";
class Topbar extends PureComponent {
  render() {
    const { changeMobileSidebarVisibility, changeSidebarVisibility, user } = this.props;

    return (
      <div className="topbar">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            <TopbarSidebarButton
                changeMobileSidebarVisibility={changeMobileSidebarVisibility}
                changeSidebarVisibility={changeSidebarVisibility}
            />
            <Link className="topbar__logo" to="/dashboard_default" />
          </div>
          <div className="topbar__right">
            <TopbarProfile user={user} />
          </div>
        </div>
      </div>
    );
  }
}

export default Topbar;

import React from 'react';
import { Link } from 'react-router-dom';

const topbarWithNavigation  = () => {
    return (
      <div className="topbar topbar--navigation">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            <Link className="topbar__logo" to="/dashboard_default" />
          </div>
          <div className="topbar__right">
          </div>
        </div>
      </div>
    );
}
export default topbarWithNavigation;

import React from 'react';
import Scrollbar from 'react-smooth-scrollbar';
import classNames from 'classnames';
import SidebarContent from './SidebarContent';

const Sidebar = ({
  changeMobileSidebarVisibility, sidebar,
}) => {
  const sidebarClass = classNames({
    'sidebar sidebar--no-desktop': true,
    'sidebar--show': sidebar.show,
  });

  return (
    <div className={sidebarClass}>
      <button className="sidebar__back" type="button" onClick={changeMobileSidebarVisibility} />
      <Scrollbar className="sidebar__scroll scroll">
        <div className="sidebar__wrapper sidebar__wrapper--mobile">
          <SidebarContent
            onClick={changeMobileSidebarVisibility}
          />
        </div>
      </Scrollbar>
    </div>
  );
};
export default Sidebar;

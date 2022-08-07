import React, {useState} from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import { Collapse } from 'reactstrap';
import TopbarMenuLink from './TopbarMenuLink';
import { logout } from '../../../redux/actions/auth';
import { connect } from 'react-redux'
const Ava = `${process.env.PUBLIC_URL}/img/ava.png`;

const topbarProfile = props => {

  const [collapse, setCollapse] = useState(false);
  const toggle = () => {
    setCollapse(!collapse);
  };
  const logout = () => {
    props.onLogout();
  }
  return (
    <div className="topbar__profile">
      <button className="topbar__avatar" type="button" onClick={toggle}>
        <img
            className="topbar__avatar-img"
            src={ props.user.avatar || Ava }
            alt="avatar"
        />
        <p className="topbar__avatar-name">
          { props.user.userInfo ? `${props.user.userInfo.fname}  ${props.user.userInfo.lname}`: ''}
        </p>
        <DownIcon className="topbar__icon" />
      </button>
      {collapse && <button className="topbar__back" type="button" onClick={toggle} />}
      <Collapse isOpen={collapse} className="topbar__menu-wrap">
        <div className="topbar__menu">
          <TopbarMenuLink
            title="Log Out"
            icon="exit"
            path="/login"
            onClick={logout}
          />
        </div>
      </Collapse>
    </div>
  );
}

export default connect(state => {
  return {
    user: state.user
  }
}, dispatch => {
  return {
    onLogout : () => dispatch(logout())
  }
})(topbarProfile);

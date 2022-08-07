import React from 'react'
import {connect} from "react-redux";
import {logout} from "../../../redux/actions/auth";
import {Redirect} from "react-router-dom";

const logOut = props => {
    props.onLogout();
    return (
        <Redirect to="/login" />
    );
}
export default connect(null, dispatch => {
    return {
        onLogout : () => dispatch(logout())
    }
})(logOut);
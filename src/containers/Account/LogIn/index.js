import React from 'react';
import { connect } from 'react-redux';

import LoginCard from '../../../shared/components/login/LoginCard';
import { auth } from '../../../redux/actions/auth'
import {Redirect} from "react-router-dom";

const LogIn = props => {
    const handleSubmit = (values) => {
        props.onAuth(values);
    };
    let authRedirect;
    if(props.isAuthenticated){
        authRedirect = <Redirect to="/" />
    }
    return (
        <>
            { authRedirect }
            <div className="account account--not-photo">
                <LoginCard onSubmit={handleSubmit}/>
            </div>
        </>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (credentials) => dispatch(auth(credentials, false))
    };
};

export default connect(
    state => {
        return {
            isAuthenticated : state.user.token !== null,
        }
    },
    mapDispatchToProps
)(LogIn)

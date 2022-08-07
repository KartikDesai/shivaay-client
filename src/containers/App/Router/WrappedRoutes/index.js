import React, {useEffect} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import Layout from '../../../Layout/index';
import DefaultDashboard from '../../../Dashboards/Practice/index';
import Appointments from '../../../Dashboards/Practice/appointments'
import PatientDashboard from '../../../Dashboards/Practice/patientDashboard';
import {authCheckState} from "../../../../redux/actions/auth";
import { connect } from 'react-redux';
import Doctors from '../../../Admin/doctors';

const WrappedRoutes = props => {
    let authReditect;
    useEffect(() => {
        props.onTryAutoSignup();
        if (!props.isAuthenticated) {
            authReditect = <Redirect to="/login" />
        }
    });
    return (
        <div>
            { authReditect }
            <Layout/>
            <div className="container__wrap">
                <Switch>
                    <Route path = "/admin/doctor" component={Doctors} />
                    <Route path="/appointments" component={Appointments}/>
                    <Route path="/" exact component={Appointments}/>
                    <Route path="/patientDashboard/:patientId/:encId" component={PatientDashboard} />
                </Switch>
            </div>
        </div>
    );
};

export default connect(state => {
    return {
        isAuthenticated : state.user.token !== null
    }
}, dispatch => {
    return {
        onTryAutoSignup: () => dispatch(authCheckState())
    };
})(WrappedRoutes)

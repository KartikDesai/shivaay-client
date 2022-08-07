import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import MainWrapper from '../MainWrapper';
import WrappedRoutes from './WrappedRoutes';
import LogIn from "../../Account/LogIn";
import LogOut from "../../Account/LogOut/LogOut";

const Router = () => {

    const routes = (
        <Switch>

            <Route path="/login" component={LogIn} />
            <Route path="/logout" component={LogOut} />
            <Route path="/" component={WrappedRoutes} />
        </Switch>
    )
    return (
        <MainWrapper>
            <main>
                { routes }
            </main>
        </MainWrapper>
    )
};

export default Router;

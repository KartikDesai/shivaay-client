import React, {useEffect, useState, Fragment} from 'react';
import {I18nextProvider} from "react-i18next";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./store";
import i18next from "i18next";
import ScrollToTop from "./ScrollToTop";
import Loading from "../../shared/components/Loading";
import {hot} from "react-hot-loader";
import 'bootstrap/dist/css/bootstrap.css';
import '../../scss/app.scss';
import { config as i18nextConfig } from '../../translations';
import Router from './Router';

i18next.init(i18nextConfig);

const app  = () => {
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        window.addEventListener('load', () => {
            setLoading(false);
            setTimeout(() => setLoaded(true), 500);
        });
    }, []);

        return (
            <Provider store={store}>
                <BrowserRouter>
                    <I18nextProvider i18n={i18next}>
                        <ScrollToTop>
                            <Fragment>
                                {!loaded
                                && (
                                    <Loading loading={loading} />
                                )
                                }
                                <div>
                                    <Router />
                                </div>
                            </Fragment>
                        </ScrollToTop>
                    </I18nextProvider>
                </BrowserRouter>
            </Provider>
        );
}

export default hot(module)(app);
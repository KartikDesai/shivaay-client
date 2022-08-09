import React, { Component } from 'react';
import Modal from '../../shared/components/Modal';
import notify from "./notification/notification";

const withErrorHandler = ( WrappedComponent, axios ) => {
    return class extends Component {
        state = {
            error: null,
            errorMessage: '',
            statusCode: null
        }

        componentWillMount () {
            this.reqInterceptor = axios.interceptors.request.use( req => {
                this.setState( { error: null, errorMessage: '', statusCode: null } );
                return req;
            } );
            this.resInterceptor = axios.interceptors.response.use( res => res, error => {
                if(error && error.response && error.response.data){
                    notify('e', error.response.data.errorMessage);
                }

                /*if(error){
                    this.setState( { error: error } );
                }
                if (error.response && error.response.data) {
                    this.setState( { errorMessage: error.response.data.errorMessage } );
                    this.setState( { status: error.response.data.status } );
                }*/
            } );
        }

        componentWillUnmount () {
            axios.interceptors.request.eject( this.reqInterceptor );
            axios.interceptors.response.eject( this.resInterceptor );
        }

        errorConfirmedHandler = () => {
            this.setState( { error: null } );
        }

        render () {
            return (
                <>
                    <Modal
                        isOpen={this.state.error != null}
                        color="danger"
                        title="Something went wrong"
                        btn="Danger"
                        onClose={this.errorConfirmedHandler}
                        message={this.state.errorMessage}
                        status={this.state.status}
                    />
                    <WrappedComponent {...this.props} />
                </>
            );
        }
    }
}

export default withErrorHandler;
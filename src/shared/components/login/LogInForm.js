import React, { PureComponent } from 'react';
import { Field, reduxForm, Form } from 'redux-form';
import { connect } from 'react-redux';
import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import { Alert, Button } from 'reactstrap';

class LogInForm extends PureComponent {

  static defaultProps = {
    errorMessage: '',
    errorMsg: ''
  }

  constructor() {
    super();
    this.state = {
      showPassword: false,
    };
    this.showPassword = this.showPassword.bind(this);
  }

  showPassword(e) {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  }

  render() {
    const {
      handleSubmit, errorMessage, errorMsg
    } = this.props;
    const { showPassword } = this.state;
    return (
      <Form className="form login-form" onSubmit={handleSubmit}>
        <Alert
          color="danger"
          isOpen={!!errorMessage || !!errorMsg}
        >
          {errorMessage}
          {errorMsg}
        </Alert>
        <div className="form__form-group mb-3">
          <span className="form__form-group-label">Username</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <AccountOutlineIcon />
            </div>
            <Field
              name="username"
              component="input"
              type="text"
              placeholder="Username"
            />
          </div>
        </div>
        <div className="form__form-group mb-3">
          <span className="form__form-group-label">Password</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <KeyVariantIcon />
            </div>
            <Field
              name="password"
              component="input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
            />
            <button
              type="button"
              className={`form__form-group-button${showPassword ? ' active' : ''}`}
              onClick={e => this.showPassword(e)}
            ><EyeIcon />
            </button>
          </div>
        </div>
        <div className="account__btns">
          <Button className="account__btn" submit="true" color="primary">Sign In</Button>
        </div>
      </Form>
    );
  }
}

export default connect(state => ({
  errorMsg: state.user.error,
}))(reduxForm()(LogInForm));

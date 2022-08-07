import React from 'react';
import LogInForm from './LogInForm';

const LoginCard = props => {
  const { onSubmit } = props;
  return (
    <div className="account__wrapper">
      <div className="account__card">
        <div className="account__head">
          <h3 className="account__title">
            <span className="account__logo"> Shivaay 
              <span className="account__logo-accent"> Clinic</span>
            </span>
          </h3>
          <h4 className="account__subhead subhead">Welcome to Shivaay Super Speciality Clinic</h4>
        </div>
        <LogInForm
          onSubmit={onSubmit}
          form="log_in_form"
        />
      </div>
    </div>
  );
};
export default LoginCard;

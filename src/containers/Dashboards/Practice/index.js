import React, { useEffect, useState } from 'react';
import {Col, Container, Row} from 'reactstrap';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import axios from "../../../shared/axiosConfig";
import { logout } from '../../../redux/actions/auth';

const DefaultDashboard = (props) => {
    const [users, setUsers] = useState([]);
    useEffect(()=>{
        axios.get("users")
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                if (err.response.status === 401) {
                    // Token Expired
                    props.onLogout();
                } else {
                    console.log(`[Dashboard/index] err: ${err.response.status}`);
                }
            })
    }, [props.onLogout]);
    return (
      <Container className="dashboard">
        <Row>
          <Col md={12}>
            {/*<h3 className="page-title">{t('dashboard_default.page_title')}</h3>*/}
            <h3>Existing users in application</h3>
              { users.map(user => ( <h5 key={user.id}>{ user.fname }</h5>)) }
          </Col>
        </Row>
      </Container>
    );
};

export default compose(withTranslation('common'))(connect(null, dispatch => {
    return {
        onLogout: () => dispatch(logout())
    }
})(DefaultDashboard));

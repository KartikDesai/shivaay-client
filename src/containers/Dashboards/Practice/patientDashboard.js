import React, {useEffect, useState, useRef} from 'react';
import axios from '../../../shared/axiosConfig'
import withErrorHandler from "../../../shared/components/withErrorHandler";
import {Col, Container, Row, Card, CardBody} from "reactstrap";
import DashboardTabs from '../Practice/dashboardTabs'
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import {Spin} from "antd";
import {connect} from "react-redux";
const patientDashboard = props => {
    const [patient, setPatient] = useState({});
    const [markingCompleted, setMarkingCompleted] = useState(false);
    const { encId, patientId } = props.match.params;
    const [markCompleteAccess, setMarkCompleteAccess] = useState(false);
    const getPatient = async (patientId, encId) => {
        const res = await axios.get(`patientDashboard/${patientId}/${encId}` );
        if (res) {
            setPatient(res.data);   
        }
    }

    useEffect(() => {
        getPatient(patientId, encId);
    }, [])


    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });

    const markCompleteHandler = async (encId) => {
        setMarkingCompleted(true);
        const res = await axios.post(`markEncComplete/${encId}`);
        if (res) {
            setMarkingCompleted(false);
            props.history.push("/appointments");
        }
    }


    useEffect(() => {
        // TODO: check performance of number of calling
        // TODO: change the way permission checking happening
        if (!props.user.userInfo || !props.user.userInfo.roles || !props.user.userInfo.roles.length === 0) {
            return;
        }
        if (props.user.userInfo.roles.find( r => r.name === "DOCTOR")) {
            setMarkCompleteAccess(true);
        }
    }, [props.user]);

    let markComplete;
    if (markCompleteAccess) {
        markComplete = (
            <button
                type="button"
                className="btn btn-xs btn-primary"
                onClick={() => markCompleteHandler(encId)}
                disabled={markingCompleted}
            >
                { markingCompleted ? <Spin size="small" /> : 'Mark Complete' }
            </button>
        )
    }

    return(
        <div className="patient-dashboard"  ref={componentRef}>
            <Container className="dashboard">
                <Row>
                    <Col md={12}>
                        <h3 className="mb-2 patient-dashboard-header">Patient Dashboard</h3>
                        <Col md={12} lg={12} xl={12} className="nopadding mb-2">
                            <Card>
                                <CardBody className="profile__card">
                                    <div className="profile__information">
                                        <div className="profile__data">
                                            <div className="patient-dashboard-header-profile">
                                                <div className="patient-dashboard-header-left">
                                                    <p className="patient__name">{ `${patient.fname} ${patient.lname}`} { `${ patient.age }Y, `}{ patient.sex === "M" ? "M": "F" }</p>
                                                    <div className="patient-headset">
                                                        <span className="lnr lnr-phone-handset" style={{marginTop: '2px', float: 'left', paddingRight: '3px'}}></span><p className="profile__work"> { patient.phone }</p>
                                                    </div>
                                                    <div className="patient-address mb-3">
                                                        <span className="lnr lnr-map-marker" style={{marginTop: '2px', float: 'left', paddingRight: '3px'}}></span><p className="profile__work mb-3"> { patient.address1 }</p>
                                                    </div>
                                                </div>
                                                <div className="patient-dashboard-header-right">
                                                    <span><strong>Date:</strong>  { moment(patient.starttime).format("DD/MM/YYYY") }</span>
                                                    <span><strong>Ref. By:</strong>  { patient.refby }</span>
                                                    <span><strong>Dr.:</strong>  { `${patient.doctorFname} ${patient.doctorLname}` }</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Card>
                            <CardBody className="dashboard__sections">
                                <DashboardTabs encId={ encId } />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={12} className="footer-buttons">
                        <button
                            type="button"
                            className="btn btn-xs btn-primary"
                            onClick={handlePrint}
                        >
                            Print
                        </button>
                        { markComplete }
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default connect(state => {
    return {
        user: state.user
    }})(withErrorHandler(patientDashboard, axios));
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
    const [enc, setEnc] = useState({});
    const [markingCompleted, setMarkingCompleted] = useState(false);
    const { encId, patientId } = props.match.params;
    const [markCompleteAccess, setMarkCompleteAccess] = useState(false);
    const getPatientDashboard = async (patientId, encId) => {
        const res = await axios.get(`patientDashboard/${patientId}/${encId}` );
        if (res) {
            setEnc(res.data);
        }
    }

    useEffect(() => {
        getPatientDashboard(patientId, encId);
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
            props.history.push("/appointments/my");
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
    if (markCompleteAccess && (enc.endtime == null || !moment(enc.endtime).isValid())) {
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
                    <Col md={12} lg={12} xl={12}>
                        {/*<h3 className="mb-2 patient-dashboard-header bold-text">Patient Dashboard</h3>*/}
                        <Col md={12} lg={12} xl={12} className="nopadding mb-2">
                            <Card>
                                <CardBody className="profile__card">
                                    <div className="profile__information">
                                        <div className="profile__data">
                                            <div className="patient-dashboard-header-profile">
                                                <div className="patient-dashboard-header-left">
                                                    <p className="patient__name">{ `${enc.fname} ${enc.lname}`} { `${ enc.age }Y, `}{ enc.sex === "M" ? "M": "F" }</p>
                                                    <p className="patient-dashboard-header-left-id bold-text">{  `ID: ${enc.patientUuid}` }</p>
                                                    <div className="patient-headset">
                                                        <span className="lnr lnr-phone-handset" style={{marginTop: '2px', float: 'left', paddingRight: '3px'}}></span><p className="profile__work"> { enc.phone }</p>
                                                    </div>
                                                    <div className="patient-address mb-3">
                                                        <span className="lnr lnr-map-marker" style={{marginTop: '2px', float: 'left', paddingRight: '3px'}}></span><p className="profile__work mb-3"> { enc.address1 }</p>
                                                    </div>
                                                </div>
                                                <div className="patient-dashboard-header-right">
                                                    <p><strong>DATE:</strong></p><p> { moment(enc.starttime).format("DD/MM/YYYY") }</p>
                                                    <p className="patient-dashboard-header-right-refby"><strong>Ref. By:</strong>  </p><p className="patient-dashboard-header-right-refby">{ enc.refby }</p>
                                                    <p><strong>DOCTOR:</strong>  </p><p><strong>DR. { `${enc.doctorFname} ${enc.doctorLname}` }</strong></p>
                                                    <p></p><p className="doctor-speciality">({enc.speciality})</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={12} lg={12} xl={12} className="nopadding mb-2 patient-dashboard-main">
                            <Card>
                                <CardBody className="dashboard__sections">
                                    <DashboardTabs encId={ encId } patientId={patientId} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Col>
                    <Col md={12} lg={12} xl={12} className="footer-buttons border-top">
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
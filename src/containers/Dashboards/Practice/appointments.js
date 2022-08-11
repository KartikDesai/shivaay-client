import React, {useEffect, useState} from 'react';
import {Form, Input, List, Table} from 'antd';
import {Button, Col, Container, Modal, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import classNames from "classnames";
import AppointmentAndRegistration from "../../Lookups/appointmentAndRegistration";
import axios from "../../../shared/axiosConfig";
import {connect} from "react-redux";
import withErrorHandler from "../../../shared/components/withErrorHandler";
import {Link} from "react-router-dom";
import notify from "../../../shared/components/notification/notification";
import classnames from "classnames";
import ChiefComplaint from "./chiefComplaints";
import {GujWords} from "../../../translations/resources";
import Medication from "./medications";


const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name',render: (data,record) => <Link to={`/patientDashboard/${record.patientId}/${record.encId}`}>{data}</Link>},
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Chief Complaint', dataIndex: 'chiefComplaint', key: 'chiefComplaint' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    /*{
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => <a>Delete</a>,
    },*/
];

const appointments = props => {
    const [modal, setModal] = useState(false);
    const [chiefComplaints, setChiefComplaints] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [encs, setEncs] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [myActiveAccess, setMyActiveAccess] = useState(false);
    
    const {theme} = props;
    const toggle = () => {
        setModal(prevState => !prevState);
    }
    const modalClasses = classNames({
        'appointment-and-registration': true,
        'ltr-support': true,
        [theme.className]: true
    });

    useEffect(() => {
        // TODO: check performance of number of calling
        // TODO: change the way permission checking happening
        if (!props.user.userInfo || !props.user.userInfo.roles || !props.user.userInfo.roles.length === 0) {
            return;
        }
        if (props.user.userInfo.roles.find( r => r.name === "DOCTOR")) {
            setMyActiveAccess(true);
        }
    }, [props.user]);

    const modelClose =()=> {
        setModal(false);
        getEncounters(activeTab);
    }

    const getEncounters = async (tab) => {
        const res = await axios.get(`/getEncs/${tab}/${props.user.userInfo.id}`);
        if (res) { setEncs(res.data); }
    }

    useEffect( ()=>{
        if (props.user.userInfo && props.user.userInfo.id && props.user.userInfo.id > 0) {
            getEncounters('all');
        }
    }, [props.user])

    useEffect(() => {
        axios.get('/chiefComplaint/getKeywords')
            .then(res => {
                setChiefComplaints(res.data);
            })
            .catch(err => {
                console.log("Error while fetching chief complaints");
            });
    }, [])

    useEffect(() => {
        axios.get('/getDoctors')
            .then(res => {
                setDoctors(res.data);
            })
            .catch(err => {
                console.log("Error while fetching doctors.");
            });
        setActiveTab('all');
    }, [])

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            getEncounters(tab);
        }
    };

    let myActiveLink;
    if (myActiveAccess) {
        myActiveLink = (
            <NavItem>
                <NavLink
                    className={classnames({active: activeTab === 'my'})}
                    onClick={() => {
                        toggleTab('my');
                    }}
                >
                    My Active
                </NavLink>
            </NavItem>
        )
    }

    return (
        <>

            <div className="tabs tabs--justify tabs--bordered-top">
                <div className="tabs__wrap">
                    <div className="col-sm-12">
                        <Nav tabs className="dashboard-navs">
                            { myActiveLink }
                            <NavItem>
                                <NavLink
                                    className={classnames({active: activeTab === 'all'})}
                                    onClick={() => {
                                        toggleTab('all');
                                    }}
                                >
                                    All Active
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: activeTab === 'past'})}
                                    onClick={() => {
                                        toggleTab('past');
                                    }}
                                >
                                    Completed
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </div>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId='my' className="p-3">
                            <Container>
                                <Row>
                                    <Col md={12} lg={12} md={12}>
                                        <Table
                                            columns={columns}
                                            dataSource={encs.map((enc, i) => (
                                                {
                                                    key: i,
                                                    name: `${enc.fname} ${enc.lname}`,
                                                    age: enc.age,
                                                    address: enc.address1,
                                                    chiefComplaint: enc.chiefComplaint,
                                                    patientId: enc.patientId,
                                                    encId: enc.encId
                                                }
                                            ))}
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </TabPane>
                        <TabPane tabId='all' className="p-3">
                            <Container>
                                <Row>
                                    <Col md={12} lg={12} md={12} className="flex flex-row-reverse mb-4">
                                        <Button color="primary" onClick={toggle}>Add Appointment</Button>
                                    </Col>
                                    <Col md={12} lg={12} md={12}>
                                        <Table
                                            columns={columns}
                                            dataSource={encs.map((enc, i) => (
                                                {
                                                    key: i,
                                                    name: `${enc.fname} ${enc.lname}`,
                                                    age: enc.age,
                                                    address: enc.address1,
                                                    chiefComplaint: enc.chiefComplaint,
                                                    patientId: enc.patientId,
                                                    encId: enc.encId
                                                }
                                            ))}
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </TabPane>
                        <TabPane tabId='past' className="p-3">
                            <Container>
                                <Row>
                                    <Col md={12} lg={12} md={12}>
                                        <Table
                                            columns={columns}
                                            dataSource={encs.map((enc, i) => (
                                                {
                                                    key: i,
                                                    name: `${enc.fname} ${enc.lname}`,
                                                    age: enc.age,
                                                    address: enc.address1,
                                                    chiefComplaint: enc.chiefComplaint,
                                                    patientId: enc.patientId,
                                                    encId: enc.encId
                                                }
                                            ))}
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </TabPane>
                    </TabContent>
                </div>
            </div>

            <Modal
                backdrop="static"
                keyboard={false}                
                isOpen={modal}
                toggle={toggle}
                className={modalClasses}
            >
                <AppointmentAndRegistration
                    chiefComplaints={chiefComplaints}
                    doctors={ doctors }
                    modelClose = {modelClose}

                />
            </Modal>
        </>
    );
}
export default connect(state=>{
    return {
        theme : state.theme,
        user: state.user
    }
})(withErrorHandler(appointments, axios));
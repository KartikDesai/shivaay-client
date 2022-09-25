import React, {useEffect, useState} from 'react';
import {DatePicker, Progress, Table} from 'antd';
import {Button, Col, Container, Modal, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import classnames from "classnames";
import AppointmentAndRegistration from "../../Lookups/appointmentAndRegistration";
import AddVitals from "../../Lookups/addVitals";
import axios from "../../../shared/axiosConfig";
import {connect} from "react-redux";
import withErrorHandler from "../../../shared/components/withErrorHandler";
import {Link} from "react-router-dom";
import {InfoCircleOutlined} from "@ant-design/icons";
import Form from "antd/es/form";
import moment from "moment";
import {isBlank} from "../../../shared/utility";

const appointments = props => {
    const [modal, setModal] = useState(false);
    const [vitalModal, setVitalModal] = useState(false);
    const [chiefComplaints, setChiefComplaints] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [encs, setEncs] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [myActiveAccess, setMyActiveAccess] = useState(false);
    const {theme} = props;
    const {currentTab} = props.match.params;
    const tabs = ['my', 'all', 'past'];
    const [currentEncId, setCurrentEncId] = useState();
    const [appointmentFilters] = Form.useForm();

    const toggle = () => {
        setModal(prevState => !prevState);
    }
    const toggleVital = (encId) => {
        setVitalModal(prevState => !prevState);
        setCurrentEncId(encId);
    }
    const modalClasses = classnames({
        'modal-popup': true,
        'ltr-support': true,
        [theme.className]: true
    });
    const vitalModalClasses = classnames({
        'modal-popup-medium': true,
        'ltr-support': true,
        [theme.className]: true
    });
    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name',render: (data,record) => <><Link to={`/patientDashboard/${record.patientId}/${record.encId}`}>{data}  </Link>
                <InfoCircleOutlined style={{color: "#ff4861", marginTop: "-2px"}} onClick={() => toggleVital(record.encId)}/></>},
        { title: 'Age(Gender)', dataIndex: 'age', key: 'age' },
        { title: 'Chief Complaint', dataIndex: 'chiefComplaint', key: 'chiefComplaint' },
        { title: 'Doctor', dataIndex: 'doctor', key: 'doctor' },
        /*{
            title: '',
            dataIndex: '',
            key: 'x',
            render: () => <TrashButton />,
        }*/
    ];
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

    const vitalModelClose =()=> {
        setVitalModal(false);
    }

    const getEncounters = async (tab) => {
        let selectedDateMoment = appointmentFilters.getFieldValue("selectedDate");
        let selectedDate = selectedDateMoment && selectedDateMoment.isValid() ? moment(selectedDateMoment).format("DD-MM-YYYY") : moment(new Date()).format("DD-MM-YYYY");
        console.log(selectedDate);
        const res = await axios.post(`/getEncs/${tab}/${props.user.userInfo.id}`, {
            selectedDate: selectedDate
        });
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
                if (res) {
                    setChiefComplaints(res.data);
                }
            })
    }, [])

    useEffect(() => {
        axios.get('/getDoctors')
            .then(res => {
                if (res) {
                    setDoctors(res.data);
                }
            })
        setActiveTab(tabs.includes(currentTab) ? currentTab : 'all');

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
                                    <Col md={12} lg={12} sm={12} >
                                        <Table
                                            columns={columns}
                                            dataSource={encs.map((enc, i) => (
                                                {
                                                    key: i,
                                                    name: enc.patientName,
                                                    age: `${enc.age}${enc.sex}`,
                                                    address: enc.address1,
                                                    chiefComplaint: enc.chiefComplaint,
                                                    patientId: enc.patientId,
                                                    encId: enc.encId,
                                                    doctor: enc.doctorName
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

                                    <Col md={12} lg={12} sm={12}>
                                        <div className="appointment-filters">
                                            <Form form={appointmentFilters} name="appointmentFilters">
                                                <Form.Item name="selectedDate">
                                                    <DatePicker
                                                        onChange={() => getEncounters(activeTab)}
                                                        allowClear={false}
                                                        format="DD-MM-YYYY"
                                                        defaultValue={moment(new Date(), 'DD-MM-YYYY')}/>
                                                </Form.Item>
                                            </Form>
                                            <button className="btn btn-xs btn-primary app-button"  onClick={toggle}>Add Appointment</button>
                                        </div>
                                    </Col>
                                    <Col md={12} lg={12} sm={12}>
                                        <Table
                                            columns={columns}
                                            dataSource={encs.map((enc, i) => (
                                                {
                                                    key: i,
                                                    name: enc.patientName,
                                                    age: `${enc.age}${enc.sex}`,
                                                    address: enc.address1,
                                                    chiefComplaint: enc.chiefComplaint,
                                                    patientId: enc.patientId,
                                                    encId: enc.encId,
                                                    doctor: enc.doctorName
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
                                    <Col md={12} lg={12} sm={12}>
                                        <div className="appointment-filters">
                                            <Form form={appointmentFilters} name="appointmentFilters">
                                                <Form.Item name="selectedDate">
                                                    <DatePicker
                                                        onChange={() => getEncounters(activeTab)}
                                                        allowClear={false}
                                                        format="DD-MM-YYYY"
                                                        defaultValue={moment(new Date(), 'DD-MM-YYYY')}/>
                                                </Form.Item>
                                            </Form>
                                            <button className="btn btn-xs btn-primary app-button"  onClick={toggle}>Add Appointment</button>
                                        </div>
                                    </Col>
                                    <Col md={12} lg={12} sm={12}>
                                        <Table
                                            columns={columns}
                                            dataSource={encs.map((enc, i) => (
                                                {
                                                    key: i,
                                                    name: enc.patientName,
                                                    age: `${enc.age}${enc.sex}`,
                                                    address: enc.address1,
                                                    chiefComplaint: enc.chiefComplaint,
                                                    patientId: enc.patientId,
                                                    encId: enc.encId,
                                                    doctor: enc.doctorName
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
                isOpen={vitalModal}
                toggle={toggleVital}
                className={vitalModalClasses}
            >
                <AddVitals
                    encId = {currentEncId}
                    modelClose={vitalModelClose}
                />
            </Modal>
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
import React, {useEffect, useState} from 'react';
import { Table } from 'antd';
import {Button, Col, Container, Modal, Row} from "reactstrap";
import classNames from "classnames";
import AppointmentAndRegistration from "../../Lookups/appointmentAndRegistration";
import axios from "../../../shared/axiosConfig";
import {connect} from "react-redux";
import withErrorHandler from "../../../shared/components/withErrorHandler";
import {Link} from "react-router-dom";
import notify from "../../../shared/components/notification/notification";


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
    
    const {theme} = props;
    const toggle = () => {
        setModal(prevState => !prevState);
    }
    const modalClasses = classNames({
        'appointment-and-registration': true,
        'ltr-support': true,
        [theme.className]: true
    });



    const showResults = values => {
        console.log(values);
        const apptData = {
            "encData": {
                "chiefcomplaints": values.chiefcomplaint && values.chiefcomplaint.length > 0 ? values.chiefcomplaint.join('\n') : '',
                "doctorId": values.concerneddoctor,
                "refby": values.refby

            },
            "patient": {
                "id": values.id && values.id > 0 ? values.id : -1,
                "fname": values.fname,
                "lname": values.lname,
                "age": values.age,
                "sex": values.sex === "M" ? "M" : "F",
                "phone": values.phone,
                "address": values.address1
            }
        }

        axios.post('createEncounter', apptData)
            .then(res => {
                setModal(false);
                getEncounters();
            })
            
    }

    const modelClose =()=>
    {
        setModal(false);
    }

    const getEncounters = async () => {
        const res = await axios.get(`/getEncs/${props.user.userInfo.id}`);
        if (res) { setEncs(res.data); }
    }

    useEffect( ()=>{
        console.log(props.user.userInfo);
        if (props.user.userInfo.id && props.user.userInfo.id > 0) {
            getEncounters();
        } else {
            notify('e', 'Something went wrong while fetching appointments. Please try again.');
        }
    }, [])

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
    }, [])
    
    return (
        <>
            <Container>
                <Row>
                    <Col md={12} lg={12} md={12} className="flex flex-row-reverse mb-4">
                        <Button color="primary" onClick={toggle}>Add Appointment</Button>
                    </Col>
                    <Col md={12} lg={12} md={12}>
                        <Table
                            columns={columns}
                           /* expandable={{
                                expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                                rowExpandable: record => record.name !== 'Not Expandable',
                            }}*/
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
            <Modal
                backdrop="static"
                keyboard={false}                
                isOpen={modal}
                toggle={toggle}
                className={modalClasses}
            >
                <AppointmentAndRegistration
                    onSubmit={showResults}
                    chiefComplaints={chiefComplaints}
                    doctors={ doctors }
                    modelClose = {modelClose}

                />
            </Modal>
        </>
    )
}
export default connect(state=>{
    return {
        theme : state.theme,
        user: state.user
    }
})(withErrorHandler(appointments, axios));
import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Modal, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import classnames from "classnames";
import {Form, Input, List, Radio, Table} from "antd";
import ChiefComplaint from "../Dashboards/Practice/chiefComplaints";
import {GujWords} from "../../translations/resources";
import Medication from "../Dashboards/Practice/medications";
import MaskedInput from "antd-mask-input";
import {Link} from "react-router-dom";
import classNames from "classnames";
import {connect} from "react-redux";
import withErrorHandler from "../../shared/components/withErrorHandler";
import axios from "../../shared/axiosConfig";
import AddDoctor from "../Admin/addDoctor";
import notify from "../../shared/components/notification/notification"

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name'},
    { title: 'Speciality', dataIndex: 'speciality', key: 'speciality' },
    { title: 'Contact No.', dataIndex: 'phone', key: 'contactno' },
    { title: 'Gender', dataIndex: 'sex', key: 'gender' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    /*{
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => <a>Delete</a>,
    },*/
];

const doctors = (props)=> {
    const [modal, setModal] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const {theme} = props;
    const modalClasses = classNames({
        'add-doctor': true,
        'ltr-support': true,
        [theme.className]: true
    });

    const modelClose = (res) => {
        setModal(false);
        getDoctors();
    }
    const toggle = () => {
        setModal(prevState => !prevState);
    }

    const getDoctors = async () => {
        const res = await axios.get('/getDoctors');
        if (res) { setDoctors(res.data); }
    }

    useEffect( ()=>{
        getDoctors();
    }, [])

    return(
        <>
            <Container>
                <Row>
                    <Col md={12} lg={12} md={12} className="flex flex-row-reverse mb-4">
                        <Button color="primary" onClick={toggle}>Add Doctor</Button>
                    </Col>
                    <Col md={12} lg={12} md={12}>
                        <Table
                            columns={columns}
                            /* expandable={{
                                 expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                                 rowExpandable: record => record.name !== 'Not Expandable',
                             }}*/
                            dataSource={doctors.map((doctor, i) => (
                                {
                                    key: i,
                                    name: `${doctor.fname} ${doctor.lname}`,
                                    speciality : doctor.speciality,
                                    phone: doctor.phone,
                                    sex : doctor.sex,
                                    address: doctor.address1,
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
                <AddDoctor
                    onClose = {modelClose}
                />
            </Modal>
        </>
    );
}
export default connect(state=>{
    return {
        theme : state.theme
    }
})(withErrorHandler(doctors, axios));
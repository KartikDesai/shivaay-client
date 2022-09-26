import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Modal, Row} from "reactstrap";
import classNames from "classnames";
import {Table} from "antd";
import {connect} from "react-redux";
import withErrorHandler from "../../shared/components/withErrorHandler";
import axios from "../../shared/axiosConfig";
import AddDoctor from "../Admin/addDoctor";

const doctors = (props)=> {
    const [modal, setModal] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const {theme} = props;
    const modalClasses = classNames({
        'add-doctor': true,
        'ltr-support': true,
        [theme.className]: true
    });

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name'},
        { title: 'Speciality', dataIndex: 'speciality', key: 'speciality' },
        { title: 'Contact No.', dataIndex: 'phone', key: 'contactno' },
        { title: 'Gender', dataIndex: 'sex', key: 'gender' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        {title: 'Action',dataIndex: '',key: 'id',render: (record) =>
                <button className="lnr lnr-user" onClick = {() => del (record.id)}>Delete</button>
        },

    ];
    const del = (id)=>{
        deleteDoctor(id);
    }
    const deleteDoctor = async (id) => {
        const res = await axios.get(`deleteDoctor/${id}` );
        if (res) { getDoctors(); }
    }

    const modelClose = () => {
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
                    <Col md={12} lg={12} sm={12} className="flex flex-row-reverse mb-4">
                        <Button color="primary" onClick={toggle}>Add Doctor</Button>
                    </Col>
                    <Col md={12} lg={12} sm={12}>
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
                                    id : doctor.id
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
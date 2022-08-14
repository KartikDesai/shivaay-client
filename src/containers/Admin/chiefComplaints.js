import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Modal, Row} from "reactstrap";
import classNames from "classnames";
import {Table} from "antd";
import {connect} from "react-redux";
import withErrorHandler from "../../shared/components/withErrorHandler";
import axios from "../../shared/axiosConfig";
import AddChiefComplaint from "../Admin/addChiefComplaint";

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name'},
    { title: 'Description', dataIndex: 'description', key: 'description' },

    /*{
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => <a>Delete</a>,
    },*/
];

const chiefComplaints = (props)=> {
    const [modal, setModal] = useState(false);
    const [chiefComplaints, setChiefComplaints] = useState([]);
    const {theme} = props;
    const modalClasses = classNames({
        'add-chief-complaint': true,
        'ltr-support': true,
        [theme.className]: true
    });

    const modelClose = (res) => {
        setModal(false);
        getChiefComplaint();
    }
    const toggle = () => {
        setModal(prevState => !prevState);
    }

    const getChiefComplaint = async () => {
        const res = await axios.get('/getChiefComplaints');
        if (res) { console.log(res.data); setChiefComplaints(res.data); }
    }

    useEffect( ()=>{
        getChiefComplaint();
    }, [])

    return(
        <>
            <Container>
                <Row>
                    <Col md={12} lg={12} sm={12} className="flex flex-row-reverse mb-4">
                        <Button color="primary" onClick={toggle}>Add Chief Complaint</Button>
                    </Col>
                    <Col md={12} lg={12} sm={12}>
                        <Table
                            columns={columns}
                            /* expandable={{
                                 expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                                 rowExpandable: record => record.name !== 'Not Expandable',
                             }}*/
                            dataSource={chiefComplaints.map((chiefComplaint, i) => (
                                {
                                    key: i,
                                    name: chiefComplaint.name,
                                    description : chiefComplaint.description,

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
                <AddChiefComplaint
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
})(withErrorHandler(chiefComplaints, axios));
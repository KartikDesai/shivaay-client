import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Modal, Row} from "reactstrap";
import classNames from "classnames";
import {Table} from "antd";
import {connect} from "react-redux";
import withErrorHandler from "../../shared/components/withErrorHandler";
import axios from "../../shared/axiosConfig";
import AddDrug from "../Admin/addDrug";

const columns = [
    { title: 'Brand Name', dataIndex: 'brandName', key: 'brandName'},
    { title: 'Content', dataIndex: 'content', key: 'content' },
    { title: 'Company Name', dataIndex: 'company', key: 'company' },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Generic', dataIndex: 'generic', key: 'generic' },
    { title: 'Type', dataIndex: 'type', key: 'type' },

    /*{
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => <a>Delete</a>,
    },*/
];

const drugs = (props)=> {
    const [modal, setModal] = useState(false);
    const [drugs, setDrugs] = useState([]);
    const {theme} = props;
    const modalClasses = classNames({
        'add-drug': true,
        'ltr-support': true,
        [theme.className]: true
    });

    const modelClose = (res) => {
        setModal(false);
        getDrugs();
    }
    const toggle = () => {
        setModal(prevState => !prevState);
    }

    const getDrugs = async () => {
        const res = await axios.get('/getDrugs');
        if (res) {  setDrugs(res.data); }
    }

    useEffect( ()=>{
        getDrugs();
    }, [])

    return(
        <>
            <Container>
                <Row>
                    <Col md={12} lg={12} sm={12} className="flex flex-row-reverse mb-4">
                        <Button color="primary" onClick={toggle}>Add Drug</Button>
                    </Col>
                    <Col md={12} lg={12} sm={12}>
                        <Table
                            columns={columns}
                            /* expandable={{
                                 expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                                 rowExpandable: record => record.name !== 'Not Expandable',
                             }}*/
                            dataSource={drugs.map((drug, i) => (
                                {
                                    key: i,
                                    brandName: drug.brandName,
                                    content : drug.content,
                                    company : drug.company,
                                    code : drug.code,
                                    generic : drug.generic,
                                    type : drug.type,

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
                <AddDrug
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
})(withErrorHandler(drugs, axios));
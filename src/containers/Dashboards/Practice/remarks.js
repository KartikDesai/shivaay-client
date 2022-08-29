import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from 'reactstrap';
import {Form, Input} from "antd";
import classNames from "classnames";
import axios from '../../../shared/axiosConfig'
import withErrorHandler from "../../../shared/components/withErrorHandler";
import useCtrlEnter from "../../../shared/hooks/ctrl-enter-hook";

const Remarks = ({ onClose, encId }) => {
    const [modelRemarks, setModelRemarks] = useState(true);
    const [remarks, setRemarks] = useState([]);
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const okRef = useRef(null)
    useCtrlEnter(okRef);

    const saveRemarks = async () => {
        const res = await axios.post('saveRemarks', { encId: encId, remarks: remarks });
        if (res && res.data) {
            console.log(res.data);
            form.resetFields();
            onClose();
        }
    };
    const onReset = () => {
        form.resetFields();
    };

    const modelRemarksClasses = classNames({
        'modal-popup': true, // TODO add remark scss insted of appointment-and-regi..
        'ltr-support': true,
        'medication': true
    });

    const toggleModelRemarks = () => {
        setModelRemarks(prevState => !prevState);
    }

    const addRemark = (value) => {
        console.log(value);
        if (value && value.remark && value.remark.trim() !== "") {
            setRemarks(remarks.concat(value.remark));
        }
        onReset();
    }

    const deleteRemark = (index) => {
        const updatedRemarks = [...remarks];
        updatedRemarks.splice(index, 1);
        setRemarks(updatedRemarks);
    }

    const getRemarks = async (encId) => {
        const res = await axios.get(`/getRemarks/${encId}` );
        if (res) {
            setRemarks(res.data);
        }
    }

    useEffect(() => {
        getRemarks(encId);
    }, [])

    let remarksTable = "";
    if (remarks.length > 0) {
        remarksTable = (
            <Table striped responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Remarks</th>
                </tr>
                </thead>
                <tbody>
                {remarks.map((remark, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{remark}</td>
                            <td>
                                <button onClick={() => deleteRemark(index)} className="close button-tooltip">
                                    <span className="lnr lnr-trash"/>
                                </button>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        )
    }

    console.log(remarks);
    return (
        <Modal
            backdrop="static"
            keyboard={false}
            isOpen={modelRemarks}
            toggle={toggleModelRemarks}
            className={modelRemarksClasses}
        >
            <ModalHeader>Add Remarks</ModalHeader>
            <ModalBody>
                <Col md={12} lg={12} className="nopadding">
                    <Card>
                        <CardBody>
                            <Form form={form} name="add-remarks" onFinish={addRemark} className="form">
                                <div className="form__form-group">
                                    <Row>
                                        <Col md={6} lg={6}>
                                            <span className="form__form-group-label">Remarks</span>
                                            <div className="form__form-group-field">
                                                <Form.Item name="remark">
                                                    <TextArea showCount maxLength={255} />
                                                </Form.Item>
                                            </div>
                                        </Col>

                                        <Col md={1} lg={1} className="nopadding">
                                            <button className="btn btn-xs btn-primary add-button" type="submit">
                                                Add
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={12} lg={12} className="nopadding">
                    <Card>
                        <CardBody>
                            {remarksTable}
                        </CardBody>
                    </Card>
                </Col>
            </ModalBody>
            <ModalFooter>
                <Button  color="primary" onClick={saveRemarks}
                        ref={okRef}>
                   OK
                </Button>
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>

    );
}
export default withErrorHandler(Remarks, axios);

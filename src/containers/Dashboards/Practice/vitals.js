import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from 'reactstrap';
import {Form, Input} from "antd";
import classNames from "classnames";
import axios from '../../../shared/axiosConfig'
import withErrorHandler from "../../../shared/components/withErrorHandler";
import useCtrlEnter from "../../../shared/hooks/ctrl-enter-hook";
import { getTimeInClientTimeZone } from '../../../shared/utility';
import VitalsTable from "./vitalsTable";

const Vitals = ({ onClose, encId, patientId }) => {
    const [modelVitals, setModelVitals] = useState(true);
    const [vitals, setVitals] = useState({});
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const okRef = useRef(null)
    useCtrlEnter(okRef);

    const saveVitals = async () => {
        const res = await axios.post('saveVitals', { encId: encId, vitals: vitals });
        if (res && res.data) {
            form.resetFields();
            onClose();
        }
    };
    const onReset = () => {
        form.resetFields();
    };

    const modelVitalsClasses = classNames({
        'modal-popup': true, // TODO add remark scss insted of appointment-and-regi..
        'ltr-support': true,
        'medication': true
    });

    const toggleModelVitals = () => {
        setModelVitals(prevState => !prevState);
    }

    const addVitals = async (medication) => {
        onReset();
    }

    const getVitalsByPatientId = async (patientId) => {
        const res = await axios.get(`/getVitals/${patientId}` );
        if (res) {
            console.log(res.data);
            setVitals(res.data);
        }
    }
    const getVitalValue = (date, vitalIdToMatch) => {
        const foundVital = vitals.capturedVitals[date].find( v => vitalIdToMatch == v.vitalid)
        return foundVital && foundVital.value ? foundVital.value : ''
    }

    useEffect(() => {
        getVitalsByPatientId(patientId);
    }, [])


    return (
        <Modal
            backdrop="static"
            keyboard={false}
            isOpen={modelVitals}
            toggle={toggleModelVitals}
            className={modelVitalsClasses}
        >
            <ModalHeader>Add Vitals</ModalHeader>
            <ModalBody>
                <Col md={12} lg={12} className="nopadding">
                    <Card>
                        <CardBody>
                            <Form form={form} name="add-vitals" onFinish={addVitals} className="form">
                                <div className="form__form-group">
                                    <Row>
                                        { vitals && vitals.capturedVitals && vitals.vitalsDictionary &&
                                        <VitalsTable
                                            capturedVitals={vitals.capturedVitals}
                                            vitalsDictionary={vitals.vitalsDictionary}
                                        /> }
                                    </Row>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={onClose}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>

    );
}
export default withErrorHandler(Vitals, axios);

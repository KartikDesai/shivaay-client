import React, {useState} from 'react';
import {Button, Card, CardBody, Col, ModalBody, ModalFooter, ModalHeader,} from 'reactstrap';
import { Form, Input} from "antd";
import axios from "../../shared/axiosConfig";

const addVitals = ({ modelClose, encId}) => {
    const [savingVitals, setSavingVitals] = useState(false);

    const saveVitals = async values => {
        setSavingVitals(true);
        const vitalsData = {
            "encId" : encId,
            "vitals": {
                "height": values.height,
                "weight": values.weight,
                "bloodpressure": values.bloodpressure,
                "pulse": values.pulse,
                "spo2": values.spo2
            }
        }
        const res = await axios.post('saveVitals', vitalsData);
        setSavingVitals(false);
        if (res) {
            modelClose();
        }
    }
    return (
        <>
            <ModalHeader>Add Vitals</ModalHeader>
            <ModalBody>
                <Col md={12} lg={12} className="nopadding">
                    <Card>
                        <CardBody>
                            <Form  name="add-vitals" onFinish={saveVitals}
                                  className="form">
                                <div className="form__half mr-4">
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Height</span>
                                        <div className="form__form-group-field">
                                            <Form.Item name="height">
                                                <Input/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Weight</span>
                                        <div className="form__form-group-field">
                                            <Form.Item name="weight">
                                                <Input/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Blood Pressure</span>
                                        <div className="form__form-group-field">
                                            <Form.Item name="bloodpressure">
                                                <Input/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Pulse</span>
                                        <div className="form__form-group-field">
                                            <Form.Item name="pulse">
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">SPO2</span>
                                        <div className="form__form-group-field">
                                            <Form.Item name="spo2">
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </ModalBody>
            <ModalFooter>
                <Button form="add-vitals" type="submit"  color="primary" disabled={savingVitals}>
                    OK
                </Button>
                <Button color="secondary"  onClick = {modelClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </>

    )
}
export default addVitals;

import React, {useState, useEffect} from 'react';
import {Button, Card, CardBody, Col, ModalBody, ModalFooter, ModalHeader,} from 'reactstrap';
import { Form, Input} from "antd";
import axios from "../../shared/axiosConfig";

const addVitals = ({ modelClose, encId}) => {
    const [savingVitals, setSavingVitals] = useState(false);
    const [vitalDict, setVitalDict] = useState([]);
    const [vitalsForm] = Form.useForm();

    const saveVitals = async values => {
        setSavingVitals(true);
        const res = await axios.post(`saveVitals/${encId}`, values);
        setSavingVitals(false);
        if (res) {
            modelClose();
        }
    }
    const getVitalsByEncId = async (encId) => {
        const res = await axios.get(`/getVitalsByEncId/${encId}` );
        if (res && res.data) {
            if (res.data.vitalsDictionary) {
                setVitalDict(res.data.vitalsDictionary);
            }
            if (!res.data.capturedVitals || res.data.capturedVitals.length === 0) {
                return;
            }
            for (let i = 0; i < res.data.capturedVitals.length; i++) {
                let capturedVital = res.data.capturedVitals[i];
                vitalsForm.setFieldsValue({
                    [capturedVital.vitalid]: capturedVital.value
                })
            }
        }
    }

    useEffect(() => {
        getVitalsByEncId(encId);
    }, [encId])

    return (
        <>
            <ModalHeader>Add Vitals</ModalHeader>
            <ModalBody>
                <Col md={12} lg={12} className="nopadding">
                    <Card>
                        <CardBody>
                            <Form form={vitalsForm} name="add-vitals" onFinish={saveVitals} className="form">
                                <div className="vital-form">
                                    { vitalDict && vitalDict.map((vital, i) => {
                                        return (
                                            <div className="form__form-group mr-2" key={i}>
                                                <span className="form__form-group-label bold-text">{vital.displayname}</span>
                                                <div className="form__form-group-field">
                                                    <Form.Item name={vital.id}>
                                                        <Input/>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        )
                                    })}
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

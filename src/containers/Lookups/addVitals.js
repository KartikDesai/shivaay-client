import React, {useState, useEffect} from 'react';
import {Button, Card, CardBody, Col, ModalBody, ModalFooter, ModalHeader,} from 'reactstrap';
import { Form, Input} from "antd";
import axios from "../../shared/axiosConfig";

const addVitals = ({ modelClose, encId}) => {
    const [savingVitals, setSavingVitals] = useState(false);
    const [vitalDict, setVitalDict] = useState([]);

    const saveVitals = async values => {
        console.log(values);
        setSavingVitals(true);
        const res = await axios.post(`saveVitals/${encId}`, values);
        setSavingVitals(false);
        if (res) {
            modelClose();
        }
    }
    const getVitalDictionary = async vitalDictionary => {
        const res = await axios.get("/vitalDictionary");
        console.log(res.data);
        setVitalDict(res.data);
    }
    useEffect(() => {
        getVitalDictionary();
    }, [])

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
                                    { vitalDict && vitalDict.map((vital, i) => {
                                        return (
                                            <div className="form__form-group" key={i}>
                                                <span className="form__form-group-label">{vital.displayname}</span>
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

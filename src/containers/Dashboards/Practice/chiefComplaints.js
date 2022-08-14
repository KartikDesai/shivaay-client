import React, {useEffect, useState} from 'react';
import {Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from 'reactstrap';
import {Form, Select} from "antd";
import classNames from "classnames";
import axios from '../../../shared/axiosConfig'
import withErrorHandler from "../../../shared/components/withErrorHandler";

const { Option } = Select;

const ChiefComplaint = ({ onClose, encId }) => {
    const [modalChiefComplaints, setModalChiefComplaints] = useState(true);
    const [keywords, setKeywords] = useState(['Abdominal Pain']);
    const [chiefComplaints, setChiefComplaints] = useState("");
    const [loaded, setLoaded] = useState(false);

    const saveChiefComplaint = async (values) => {
        if (!values.chiefComplaints || values.chiefComplaints.length === 0) {
            onClose();
            return;
        }
        const res = await axios.post('chiefComplaint/save', { encId: encId, chiefComplaints: values.chiefComplaints.join('\n') });
        if (res && res.data) {
            onClose();
        }
    };

    const modalChiefComplaintsClasses = classNames({
        'appointment-and-registration': true,
        'ltr-support': true,
        'medication': true
    });

    const toggleModalChiefComplaints = () => {
        setModalChiefComplaints(prevState => !prevState);
    }

    useEffect(() => {
        axios.get('/chiefComplaint/getKeywords')
            .then(res => {
                setKeywords(res.data);
            })
    }, [])

    const getChiefComplaints = async (encId) => {
        const res = await axios.get(`chiefComplaint/get/${encId}` );
        if (res) {
            setChiefComplaints(res.data);
            setLoaded(true);
        }
    }

    useEffect(() => {
        getChiefComplaints(encId);
    }, [])

    return (
        <Modal
            backdrop="static"
            keyboard={false}
            isOpen={modalChiefComplaints}
            toggle={toggleModalChiefComplaints}
            className={modalChiefComplaintsClasses}
        >
            <ModalHeader>Add ChiefComplaints</ModalHeader>
            <ModalBody>
                <Col md={12} lg={12} className="nopadding">
                    <Card>
                        <CardBody>
                            { loaded ?
                            <Form name="chief-complaints" onFinish={saveChiefComplaint} className="form">
                                <div className="form__form-group">
                                    <Row>
                                        <Col md={6} lg={6}>
                                            <div className="form__form-group">
                                                <span className="form__form-group-label">Chief Complaints</span>
                                                <div className="form__form-group-field">
                                                    <Form.Item name="chiefComplaints">
                                                        <Select
                                                            mode="multiple"
                                                            style={{width: '100%'}}
                                                            placeholder="Add Chief Complaints"
                                                            optionLabelProp="label"
                                                            defaultValue={ chiefComplaints.split(', ').filter(c => c.trim() !== '').map(c => c.trim())}
                                                        >
                                                            {keywords.map((keyword, index) => {
                                                                return (
                                                                    <Option
                                                                        key={index} value={keyword.name} label={keyword.name}>
                                                                        <div className="demo-option-label-item">
                                                                            { keyword.name }
                                                                        </div>
                                                                    </Option>
                                                                )
                                                            } )}
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                                : ''}
                        </CardBody>
                    </Card>
                </Col>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" form="chief-complaints" type="submit">
                    OK
                </Button>
                <Button color="secondary"  onClick = {onClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>

    );
}
export default withErrorHandler(ChiefComplaint, axios);

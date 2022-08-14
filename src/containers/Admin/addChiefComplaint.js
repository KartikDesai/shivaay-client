import React, {useEffect} from 'react';
import {Button, Card, CardBody, Col, ModalBody, ModalFooter, ModalHeader,} from 'reactstrap';
import { Form, Input} from "antd";
import axios from "../../shared/axiosConfig";
import useFocus from "../../shared/hooks/use-focus-hook";
import notify from "../../shared/components/notification/notification";

const { TextArea } = Input;

const addChiefComplaint = ({ onClose }) => {

    const [fnameRef, setFnameFocus] = useFocus();
    const [form] = Form.useForm();

    useEffect(() => {
        setFnameFocus();
    }, [])

    const saveChiefComplaint = values => {
        const chiefComplaint = {
            // TODO: Code Refactor
            "name": values.name,
            "description" : values.description,

        }

        axios.post('createChiefComplaint', chiefComplaint)
            .then(res => {
                form.resetFields();
                onClose(res);
                notify('s', 'Chief Complaint has been added successfully.')
            })
    }

    return (
        <>
            <ModalHeader>Add Chief Complaint</ModalHeader>
            <ModalBody>
                <Col md={12} lg={12} className="nopadding">
                    <Card>
                        <CardBody>
                            <Form form={form} name="add-chief-complaint" onFinish={saveChiefComplaint} className="form">
                                <div className="form__half"></div>
                                <div className="form__half mr-4">
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Name</span>
                                        <div className="form__form-group-field">
                                            <Form.Item
                                                name="name"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input complaint name!',
                                                        whitespace: true,
                                                    },
                                                ]}
                                            >
                                                <Input ref={fnameRef}/>
                                            </Form.Item>
                                        </div>
                                        <span className="form__form-group-label">Description</span>
                                        <div className="form__form-group-field">
                                            <Form.Item
                                                name="description"
                                            >
                                                <TextArea />
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
                <Button form="add-chief-complaint" type="submit"  color="primary">
                    OK
                </Button>
                <Button color="secondary"  onClick = {() => onClose(true)}>
                    Cancel
                </Button>
            </ModalFooter>
        </>

    )
}
export default addChiefComplaint;

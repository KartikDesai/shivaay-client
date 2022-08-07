import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, CardBody, Col, ModalBody, ModalFooter, ModalHeader,} from 'reactstrap';
import { Form, Input, Radio, Select} from "antd";
import MaskedInput from 'antd-mask-input'
import DSelect from "../../shared/components/form/DSelect";
import axios from "../../shared/axiosConfig";
import useFocus from "../../shared/hooks/use-focus-hook";
import notify from "../../shared/components/notification/notification";


const { Option } = Select;
const { TextArea } = Input;

const addDoctor = ({ onClose }) => {

    const [fnameRef, setFnameFocus] = useFocus();
    const [form] = Form.useForm();

    useEffect(() => {
        setFnameFocus();
    }, [])

    const saveDoctor = values => {
        const doctor = {
            // TODO: Code Refactor
            "username": values.username,
            "password" : values.password,
            "fname" : values.fname,
            "lname": values.lname,
            "age": values.age,
            "sex": values.sex === "M" ? "M" : "F",
            "phone": values.phone,
            "address1": values.address1,
            "speciality" : values.speciality,
            "bio" : values.bio
        }

        axios.post('createDoctor', doctor)
            .then(res => {
                form.resetFields();
                onClose(res);
                notify('s', 'Doctor has been added successfully.')
            })
    }

    return (
        <>
            <ModalHeader>Add Doctor</ModalHeader>
            <ModalBody>
                <Col md={12} lg={12} className="nopadding">
                    <Card>
                        <CardBody>
                            <Form form={form} name="add-doctor" onFinish={saveDoctor} className="form" autocomplete="off" initialValues={{"sex": "M"}}>
                                <div className="form__half"></div>
                                <div className="form__half mr-4">
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">User Name</span>
                                        <div className="form__form-group-field">
                                            <Form.Item
                                                name="username"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input user name!',
                                                        whitespace: true,
                                                    },
                                                ]}
                                            >
                                                 <Input ref={fnameRef} autoComplete="off"/>
                                            </Form.Item>
                                        </div>
                                        <span className="form__form-group-label">Password</span>
                                        <div className="form__form-group-field">
                                            <Form.Item
                                                name="password"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input password!',
                                                        whitespace: true,
                                                    },
                                                ]}
                                            >
                                                <Input type="password" autoComplete="new-password" />
                                            </Form.Item>
                                        </div>
                                        <span className="form__form-group-label">First Name</span>
                                        <div className="form__form-group-field">
                                            <Form.Item
                                                name="fname"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input first name!',
                                                        whitespace: true,
                                                    },
                                                ]}
                                            >

                                               <Input/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Last Name</span>
                                        <div className="form__form-group-field">
                                            <Form.Item
                                                name="lname"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input last name!',
                                                        whitespace: true,
                                                    },
                                                ]}
                                            >
                                                <Input/>
                                            </Form.Item>
                                        </div>
                                    </div>


                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Phone Number</span>
                                        <div className="form__form-group-field">
                                            <Form.Item name="phone">
                                                <MaskedInput mask="1111111111" name="phone"/>
                                            </Form.Item>
                                        </div>
                                    </div>

                                </div>

                                <div className="form__half">
                                    <div className="form__form-group">
                                        <div className="form__form-group">
                                            <span className="form__form-group-label">Gender</span>
                                            <div className="form__form-group-field">
                                                <Form.Item name="sex">
                                                    <Radio.Group>
                                                        <Radio value="M">Male</Radio>
                                                        <Radio value="F">Female</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Speciality</span>
                                        <div className="form__form-group-field">
                                            <Form.Item
                                                name="speciality"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input speciality!',
                                                        whitespace: true,
                                                    },
                                                ]}

                                            >
                                                <Input/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Bio</span>
                                        <div className="form__form-group-field">
                                            <Form.Item name="bio" >
                                                <TextArea/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Address</span>
                                        <div className="form__form-group-field">
                                            <Form.Item name="address1" >
                                                <Input/>
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
                <Button form="add-doctor" type="submit"  color="primary">
                    OK
                </Button>
                <Button color="secondary"  onClick = {() => onClose(true)}>
                    Cancel
                </Button>
            </ModalFooter>
        </>

    )
}
export default addDoctor;

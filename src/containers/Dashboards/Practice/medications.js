import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from 'reactstrap';
import {Form, Input, Select, Spin} from "antd";
import classNames from "classnames";
import axios from '../../../shared/axiosConfig'
import withErrorHandler from "../../../shared/components/withErrorHandler";
import {GujWords} from '../../../translations/resources'
import useCtrlEnter from "../../../shared/hooks/ctrl-enter-hook";
import DSelect from "../../../shared/components/form/DSelect";
import notify from "../../../shared/components/notification/notification";
import {EnterOutlined} from "@ant-design/icons";
import {isBlank} from "../../../shared/utility";

const { Option } = Select;

const Medication = ({ onClose, encId }) => {
    const [modalMedications, setModalMedications] = useState(true);
    const [freqCodes, setFreqCodes] = useState([]);
    const [drugs, setDrugs] = useState([]);
    const [query, setQuery] = useState();
    const [addingDrug, setAddingDrug] = useState(false);
    const [savingMedications, setSavingMedications] = useState(false);
    const [medications, setMedications] = useState([]);
    // const [brandNameRef, setBrandNameFocus] = useFocus()
    const [form] = Form.useForm();

    const okRef = useRef(null)
    useCtrlEnter(okRef);

    const validateAndSaveMedication = () => {
        // TODO: Validation
        saveMedication();
    }

    const prepareMedicationDataToSave = () => {
        const medicationDataToSave = [];
        for (let i = 0; i < medications.length; i++) {
            let medication = medications[i];
            if((medication.medId === 0 && !medication.deleted) || (medication.medId > 0 && medication.deleted)){
                // Add if newly added (not deleted) or
                // if old deleted (deleted)
                medicationDataToSave.push({
                    'medId': medication.medId,
                    'id': medication.id,
                    'freqCodeId': medication.freqCodeId,
                    'duration': medication.duration,
                    'deleted': medication.deleted || false,
                    displayOrder: 0
                })
            }
            if (!medication.children) {
                continue;
            }
            for (let j = 0; j < medication.children.length; j++) {
                let childMedication = medication.children[j];
                if((childMedication.medId === 0 && !childMedication.deleted) || (childMedication.medId > 0 && childMedication.deleted)){
                    medicationDataToSave.push({
                        'medId': childMedication.medId,
                        'id': childMedication.id,
                        'freqCodeId': childMedication.freqCodeId,
                        'duration': childMedication.duration,
                        'deleted': childMedication.deleted,
                        displayOrder: childMedication.displayOrder
                    });
                }
            }
        }
        setSavingMedications(false);
        return medicationDataToSave;
    };

    const saveMedication = async () => {
        setSavingMedications(true);
        const medicationDataToSave = prepareMedicationDataToSave(medications);
        if (medicationDataToSave && medicationDataToSave.length === 0) {
            closeMedicationScreen();
        }
        const res = await axios.post('medication/save', { encId: encId, medications: medicationDataToSave });
        setSavingMedications(false);
        if (res && res.data) {
            closeMedicationScreen();
        }
    };

    const closeMedicationScreen = () => {
        form.resetFields();
        onClose();
    };

    const onReset = () => {
        setAddingDrug(false);
        form.resetFields();
    };

    const modalMedicationsClasses = classNames({
        'modal-popup': true,
        'ltr-support': true,
        'medication': true
    });

    const toggleModalMedications = () => {
        setModalMedications(prevState => !prevState);
    }

    const fetchFreqCodes = async () => {
        const res = await axios.get('/getFrequencyCodes')
        if(res){ setFreqCodes(res.data); }
    }

    const fetchDrugs = async (query) => {
        if (query) {
            const res = await axios.get(`/getDrugs/${query}`);
            if(res){
                if (res.data.length === 0) {
                    res.data.push({"brandName": `${query}`, isNew: true, id: -1 * Math.random() });
                }
                setDrugs(res.data);
            }
        } else {
            setDrugs([]);
        }
    }
    const handleChange = query => {
        setQuery(query);
    };

    useEffect(() => {
        fetchFreqCodes();
    }, [])

    const getMedications = async (encId) => {
        const res = await axios.get(`medication/get/${encId}` );
        if (res && res.data) {
            setMedications(res.data);
        }
    }

    const deleteMedication = (medId, index) => {
        let indexToBeDeleted  = medId === 0 ? index : medications.findIndex(medication => medication.medId === medId);
        const updatedMedications = [...medications];
        if (medId === 0) {
            // delete newly added parent-children
            updatedMedications.splice(indexToBeDeleted, 1);
        } else {
            let medicationToDelete = updatedMedications[indexToBeDeleted];

            // delete all child
            if (medicationToDelete.children && medicationToDelete.children.length > 0) {
                for (let i = 0; i < medicationToDelete.children.length; i++) {
                    let childMedication = medicationToDelete.children[i];
                    if (childMedication.medId === 0) {
                        // new child medication
                        updatedMedications.splice(indexToBeDeleted, 1);
                    } else {
                        // old child medication
                        medicationToDelete.children[i] = { medId: childMedication.medId, deleted: true };
                    }
                }
            }

            // delete parent
            updatedMedications[indexToBeDeleted] = {
                medId: updatedMedications[indexToBeDeleted].medId,
                deleted: true,
                children: updatedMedications[indexToBeDeleted].children
            };
        }
        setMedications(updatedMedications);
    }

    useEffect(() => {
        getMedications(encId);
    }, [])

    const saveDrug = async (drugName) => {
        const res = await axios.post(`/saveDrug/`, { drugName: drugName });
        if (res) {
            return res.data;
        } else {
            return -1;
        }
    }

    const addMedication = async (medication) => {
        setAddingDrug(true);
        let addedDrugId = -1;
        let isNewDrug = medication.drugId.value < 0 && medication.drugId.label !== "";
        let brandName = medication.drugId.label;
        if (isNewDrug) {
            addedDrugId = await saveDrug(brandName);
            medication.drugId = { value: addedDrugId, label: brandName };
        }
        if (isNewDrug && addedDrugId === -1) {
            setAddingDrug(false);
            notify('e', 'Something went wrong while adding new drug.')
            return;
        }

        if (!medication.drugId || !medication.drugId.value || !medication.freqCodeId || !medication.duration) {
            setAddingDrug(false);
            return;
        }
        let freqCode = freqCodes.find(freqCode => freqCode.id === medication.freqCodeId);
        let medicationIndex = medications.findIndex(m => m.id == medication.drugId.value && !m.deleted);
        if (medicationIndex > -1) {
            // If drug is already added, then add drug as a child
            let updatedMedications = [...medications];
            let children = updatedMedications[medicationIndex]['children'] || [];
            children.push({
                ...(!isNewDrug ? drugs.find(drug => drug.id === medication.drugId.value): { id: addedDrugId, brandName: brandName}),
                freqCode: freqCode.code,
                freqCodeId: medication.freqCodeId,
                duration: medication.duration,
                displayOrder: children.length + 1,
                medId: 0 // For newly added medication,
            })
            updatedMedications[medicationIndex]['children'] = children;
            setMedications(updatedMedications);
        } else {
            setMedications(medications.concat({
                ...(!isNewDrug ? drugs.find(drug => drug.id === medication.drugId.value): { id: addedDrugId, brandName: brandName}),
                freqCode: freqCode.code,
                freqCodeId: medication.freqCodeId,
                duration: medication.duration,
                medId: 0 // For newly added medication,
            }));
        }

        onReset();
        // setBrandNameFocus();
    }

    let medicationTable = "";
    if (medications.length > 0) {
        medicationTable = (
            /*<PerfectScrollbar style={{ height: '300px'}}>*/
                <Table striped responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Brand Name</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {medications.filter(medication => !medication['deleted']).map((medication, index) => {
                        return (
                            <>
                                <tr key={index}>
                                    <td className="bold-text">{index + 1}</td>
                                    <td className="bold-text brandname">{medication.brandName}</td>
                                    <td className="gj-fnt-14">{GujWords['freqCodes'][medication.freqCode]}</td>
                                    <td>{medication.duration} Days</td>
                                    <td>
                                        <button onClick={() => deleteMedication(medication.medId, index)}
                                                className="close button-tooltip">
                                            <span className="lnr lnr-trash"/>
                                        </button>
                                    </td>
                                </tr>
                                { medication.children && medication.children.filter(child => !child['deleted']).map((child, cIndex) => {
                                    return (
                                        <tr key={`${index}-${cIndex}`}>
                                            <td></td>
                                            <td className="flex flex-column-reverse"><EnterOutlined style={{ fontSize: "16px", transform: "rotateY(180deg)"}} /></td>
                                            <td className="gj-fnt-14">{`${GujWords['afterthat']}  ${GujWords['freqCodes'][child.freqCode]}`}</td>
                                            <td>{child.duration} Days</td>
                                            <td></td>
                                        </tr>
                                    )
                                })}
                            </>
                        )
                    })}
                    </tbody>
                </Table>
            /*</PerfectScrollbar>*/
        )
    }

    return (
        <Modal
            backdrop="static"
            keyboard={false}
            isOpen={modalMedications}
            toggle={toggleModalMedications}
            className={modalMedicationsClasses}
        >
            <ModalHeader>Add Medications</ModalHeader>
            <ModalBody>
                <Col md={12} lg={12} className="nopadding">
                    <Card>
                        <CardBody>
                            <Form form={form} name="medications" onFinish={addMedication}
                                  initialValues={{"sex": "male"}}
                                  className="form">
                                <div className="form__form-group">
                                    <Row>
                                        <Col md={6} lg={6}>
                                            <span className="form__form-group-label">BrandName</span>
                                            <div className="form__form-group-field">
                                                <Form.Item name="drugId">

                                                    <DSelect
                                                        value={query}
                                                        placeholder="Search Drug"
                                                        fetchOptions={fetchDrugs}
                                                        onChange={handleChange}
                                                        labelInValue
                                                        optionLabelProp="label"
                                                    >
                                                        {
                                                            drugs.map((drug, index) => {
                                                                return (
                                                                    <Option key={index} value={drug.id} label={drug.brandName}>
                                                                        <div className="search-medication-result">
                                                                            <span className="fnt-weight-400">{drug.brandName}</span>
                                                                            { !isBlank(drug.content) ?
                                                                                <span className="fnt10 light-gray-italic">({drug.content})</span>
                                                                                : '' }
                                                                        </div>
                                                                    </Option>
                                                                );
                                                            })
                                                        }
                                                    </DSelect>
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col md={3} lg={3}>
                                            <span className="form__form-group-label">Frequency</span>
                                            <div className="form__form-group-field">
                                                <Form.Item name="freqCodeId">
                                                    <Select
                                                        showSearch
                                                        placeholder="Select Frequency"
                                                        optionFilterProp="children"
                                                        optionLabelProp="label"
                                                        filterOption={(input, option) => option.children.replaceAll('-', '').toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    >
                                                        {
                                                            freqCodes.map((freqCode, index) => {
                                                                return (
                                                                    <Option key={index} value={freqCode.id}
                                                                             label={freqCode.description}>
                                                                        {freqCode.code}
                                                                    </Option>
                                                                );
                                                            })
                                                        }

                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col md={2} lg={2}>
                                            <span className="form__form-group-label">Duration (Days)</span>
                                            <div className="form__form-group-field">
                                                <Form.Item name="duration">
                                                    <Input type="Number" maxLength="3" minLength="1"/>
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col md={1} lg={1} className="nopadding">
                                            <button disabled={addingDrug} className="btn btn-xs btn-primary add-button" type="submit">
                                                { addingDrug ? <Spin size="small" /> : 'Add' }
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
                            {medicationTable}
                        </CardBody>
                    </Card>
                </Col>
            </ModalBody>
            <ModalFooter>
                <Button disabled={savingMedications} color="primary" type="submit" onClick={validateAndSaveMedication}
                        ref={okRef}>
                        { savingMedications ? <Spin size="small" /> : 'OK' }
                </Button>
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>

    );
}
export default withErrorHandler(Medication, axios);

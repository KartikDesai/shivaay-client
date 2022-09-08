import React, {useEffect, useState} from "react";
import {Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import {Form, Input, List} from "antd";
import Medication from "./medications";
import axios from "../../../shared/axiosConfig";
import ChiefComplaint from "./chiefComplaints";
import Remarks from "./remarks";
import Vitals from "./vitals";
import {GujWords} from "../../../translations/resources";
import {connect} from "react-redux";
import VitalsTable from './vitalsTable'

const dashboardTabs = ({ encId, user, patientId }) => {
    const [followUp, setFollowUp] = useState(0);
    const [followupDays,setFollowupDays] = useState(0   );

    const [activeTab, setActiveTab] = useState(1);
    const [medicationModel, setMedicationModel] = useState(false);
    const [chiefComplaintModel, setChiefComplaintModel] = useState(false);
    const [remarksModel, setRemarksModel] = useState(false);
    const [vitalsModel, setVitalsModel] = useState(false);
    const [medications, setMedications] = useState(false);
    const [chiefComplaints, setChiefComplaints] = useState(false);
    const [remarks, setRemarks] = useState([]);
    const [vitals, setVitals] = useState({});

    const [form] = Form.useForm();
    const [pnSectionAccess, setPnSectionAccess] = useState(false);

    /* this is for force update */
    const [value, setValue] = useState(0); // integer state
    function forceUpdate(){
        setValue(value => value + 1); // update the state to force render
    }
    /* try to avoid this pattern*/

    const getMedications = async (encId) => {
        const res = await axios.get(`medication/get/${encId}` );
        if (res) {
            setMedications(res.data);
        }
    }

    const getChiefComplaints = async (encId) => {
        const res = await axios.get(`chiefComplaint/get/${encId}` );
        if (res) {
            setChiefComplaints(res.data);
        }
    }
    const getRemarks = async (encId) => {
        const res = await axios.get(`/getRemarks/${encId}` );
        if (res) {
            setRemarks(res.data);
        }
    }

    useEffect(() => {
        getMedications(encId);
        getChiefComplaints(encId);
        getRemarks(encId);
    }, [value])

    const toggle = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    useEffect(() => {
        // TODO: check performance of number of calling
        // TODO: change the way permission checking happening
        if (!user.userInfo || !user.userInfo.roles || !user.userInfo.roles.length === 0) {
            return;
        }
        if (user.userInfo.roles.find( r => r.name === "DOCTOR")) {
            setPnSectionAccess(true);
        }
    }, [user]);


    const onFollowupBlur = async() =>{
        let days = form.getFieldValue("days");
        if(days >= 0){
            const res = await axios.post('saveAdvice', { encId: encId, followupAfter : days });
            if (res && res.data) {
                setFollowupDays(days);
            }
            else {
                setFollowupDays(0);
            }
        }
        else{
            setFollowupDays(0);
        }
        setFollowUp(false);

    }
    const getFollowupDaysByEncId = async (encId) => {

        const res = await axios.get(`/getAdvice/${encId}` );
        if (res) {
            console.log('res data ' + res.data);
            setFollowupDays(res.data);
        }
    }

    useEffect(()=> {
            getFollowupDaysByEncId(encId);
    },[]);

    const onSubmit = (module) => {
        closeModalMedications();
        forceUpdate();
    }
    
    const openModalMedications = () => {
        setMedicationModel(true);
    }

    const closeModalMedications = () => {
        setMedicationModel(false);
        forceUpdate();
    }

    const openModalChiefComplaint = () => {
        setChiefComplaintModel(true);
    }

    const closeModalChiefComplaint = () => {
        setChiefComplaintModel(false);
        forceUpdate();
    }

    const openModalRemarks = () => {
        setRemarksModel(true);
    }
    const closeModalRemarks = () => {
        setRemarksModel(false);
        forceUpdate();
    }

    const openModalVitals = () => {
        setVitalsModel(true);
    }
    const closeModalVitals = () => {
        setVitalsModel(false);
        forceUpdate();
    }

    useEffect(() => {
        toggle('medical-summary');     
    }, [])

    const getVitalsByPatientId = async (patientId) => {
        const res = await axios.get(`/getVitals/${patientId}` );
        if (res) {
            setVitals(res.data);
        }
    }

    useEffect(() => {
        getVitalsByPatientId(patientId);
    }, [])
    return (
        <div className="tabs tabs--justify tabs--bordered-top">
            <div className="tabs__wrap">
                <Nav tabs className="dashboard-navs">
                    <NavItem>
                        <NavLink
                            className={classnames({active: activeTab === 'medical-summary'})}
                            onClick={() => {
                                toggle('medical-summary');
                            }}
                        >
                            Medical Summary
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activeTab === 'past-visits'})}
                            onClick={() => {
                                toggle('past-visits');
                            }}
                        >
                            Past Visits
                        </NavLink>
                    </NavItem>
                </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId='medical-summary' className="p-3 nopadtop">
                            <List className="nopadding">
                                <List.Item>
                                    <div className="col-sm-12">
                                        <div className="col-sm-12 nopadding flex-space-between uppercase">
                                            { pnSectionAccess ?
                                            <div><strong><span onClick={openModalChiefComplaint}>C/O - Diagnosis</span></strong></div>
                                                :<div><strong><span>C/O - Diagnosis</span></strong></div> }
                                            {/*<div>25/02/2021</div>*/}
                                        </div>
                                        <div className="col-sm-12 nopadding ml-2">
                                            { chiefComplaints }
                                        </div>
                                    </div>
                                    { chiefComplaintModel && <ChiefComplaint onClose={closeModalChiefComplaint} onSubmit={onSubmit} encId={ encId }/> }
                                </List.Item>

                                <List.Item>
                                    <div className="col-sm-12">
                                        <div className="col-sm-12 nopadding flex-space-between uppercase">
                                            { pnSectionAccess ?
                                                <div><strong><span onClick={openModalMedications}><i className="fnt16 rx-symbol fas fa-prescription"></i> <span className="medication-label">Medications</span></span></strong></div>
                                                : <div><strong><span>Medications</span></strong></div> }

                                            {/*<div>25/02/2021</div>*/}
                                        </div>
                                        <div className="col-sm-12 nopadding ml-2">
                                            { medications && medications.length > 0 ? medications.map((medication, i) => {
                                                return (
                                                    <div className="col-sm-12 nopadding medications">
                                                        <div><strong>{ i+1 }. </strong></div>
                                                        <div>{  medication.brandName } </div>
                                                        <div> { GujWords['freqCodes'][medication.freqCode]} <span className="freqCodes">({ medication.freqCode.substring(0, medication.freqCode.length - 2) }) </span> </div>
                                                        <div className="text-right"> ({ medication.duration }) </div>
                                                    </div>
                                                )
                                            }): ''}
                                        </div>
                                    </div>
                                    { medicationModel && <Medication onClose={closeModalMedications} onSubmit={onSubmit} encId={ encId }/> }
                                </List.Item>

                                <List.Item>
                                    <div className="col-sm-12">
                                        <div className="col-sm-12 nopadding flex-space-between uppercase">
                                            { pnSectionAccess ?
                                                <div><strong><span onClick={openModalRemarks}>Remarks</span></strong></div>
                                                :<div><strong><span>Remarks</span></strong></div> }
                                        </div>
                                        <div className="col-sm-12 nopadding ml-2">
                                            { remarks && remarks.length > 0 ? remarks.map((remark, i) => {
                                                return (
                                                    remark && remark.trim() !== "" ?
                                                        <div className="col-sm-12 nopadding medications">
                                                            <div><strong>{ i+1 }. </strong></div>
                                                            <div>{  remark } </div>
                                                        </div>
                                                    : ''
                                                )
                                            }): ''}
                                        </div>
                                    </div>
                                    { remarksModel && <Remarks onClose={closeModalRemarks} onSubmit={onSubmit} encId={ encId }/> }
                                </List.Item>

                                <List.Item className="patient-dashboard-vitals">
                                    <div className="col-sm-12">
                                        <div className="col-sm-12 nopadding flex-space-between uppercase">
                                            { pnSectionAccess ?
                                                <div><strong><span onClick={openModalVitals}>Vitals</span></strong></div>
                                                :<div><strong><span>Vitals</span></strong></div> }
                                        </div>
                                        <div className="col-sm-12 nopadding ml-2">
                                            { vitals && vitals.capturedVitals && vitals.vitalsDictionary &&
                                                <VitalsTable
                                                    capturedVitals={vitals.capturedVitals}
                                                    vitalsDictionary={vitals.vitalsDictionary}
                                                /> }
                                        </div>
                                    </div>
                                    { vitalsModel && <Vitals onClose={closeModalVitals} onSubmit={onSubmit} patientId={ patientId }/> }
                                </List.Item>


                            <List.Item>
                                <div className="col-sm-12">
                                    {/*<div className="col-sm-12 nopadding" style={{display: "flex", justifyContent: "space-between", textTransform:"uppercase"}}>
                                        <div><strong><span >Advice</span></strong></div>
                                    </div>*/}
                                    <div className="col-sm-12 ml-1 advice-followup">
                                            <div>Follow up after:</div>
                                            {followUp ?
                                                <div>
                                                    <Form form={form} name="folloup" onBlur={onFollowupBlur}  >
                                                        <Form.Item name="days"
                                                                rules={[ {
                                                                        pattern: /^(?:\d*)$/,
                                                                        message: "Value should contain just positive number",
                                                                    }
                                                                ]}>
                                                            <Input maxLength="2" />
                                                            </Form.Item>
                                                        </Form>
                                                </div>
                                                    : <label onClick={() => setFollowUp(true)} > {followupDays > 0 ? `${followupDays} Days` : 'N/A'} </label>
                                            }
                                            {/*<div><label className="pl-1"> </label></div>*/}
                                    </div>
                                </div>
                            </List.Item>
                            </List>
                        </TabPane>
                        <TabPane tabId='past-visits' className="p-3">
                            <p>Coming Soon..
                            </p>
                        </TabPane>
                    </TabContent>
            </div>
        </div>
    );
};
export default connect(state => {
    return {
        user: state.user
    }})(dashboardTabs);
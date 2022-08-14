import React, {useEffect, useState} from "react";
import {Nav, NavItem, NavLink, TabContent, TabPane,} from 'reactstrap';
import classnames from 'classnames';
import {Form, Input, List} from "antd";
import Medication from "./medications";
import axios from "../../../shared/axiosConfig";
import ChiefComplaint from "./chiefComplaints";
import {GujWords} from "../../../translations/resources";
import {connect} from "react-redux";

const dashboardTabs = ({ encId, user }) => {
    const [followUp, setFollowUp] = useState(0);
    const [activeTab, setActiveTab] = useState(1);
    const [medicationModel, setMedicationModel] = useState(false);
    const [chiefComplaintModel, setChiefComplaintModel] = useState(false);
    const [medications, setMedications] = useState(false);
    const [chiefComplaints, setChiefComplaints] = useState(false);
    const [form] = Form.useForm();
    const [preFollowupDays,setPreFollowupDays] = useState(0);
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

    useEffect(() => {
        getMedications(encId);
        getChiefComplaints(encId);
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
        if(form.getFieldValue("days") !== preFollowupDays)
        {
            setPreFollowupDays(form.getFieldValue("days"));
            const res = await axios.post('saveAdvice', { encId: encId, followupAfter : form.getFieldValue("days") });
            if (res && res.data) {
                setFollowUp(false);
                // console.log('followup data saved on server')
            }
        }
    }

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

    useEffect(() => {
        toggle('medical-summary');     
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
                                            <div><strong><span onClick={openModalChiefComplaint}>Chief Complaints</span></strong></div>
                                                :<div><strong><span>Chief Complaints</span></strong></div> }
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
                                                <div><strong><span onClick={openModalMedications}>Medications</span></strong></div>
                                                : <div><strong><span>Medications</span></strong></div> }

                                            {/*<div>25/02/2021</div>*/}
                                        </div>
                                        <div className="col-sm-12 nopadding ml-2">
                                            { medications && medications.length > 0 ? medications.map((medication, i) => {
                                                return (
                                                    <div className="col-sm-12 nopadding medications">
                                                        <div><strong>[{ i+1 }] </strong></div>
                                                        <div>{  medication.brandName } </div>
                                                        <div> { GujWords['freqCodes'][medication.freqCode]} ({ medication.freqCode.substring(0, medication.freqCode.length - 2) })  </div>
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
                                    <div className="col-sm-12 nopadding" style={{display: "flex", justifyContent: "space-between", textTransform:"uppercase"}}>
                                        <div><strong><span >Advice</span></strong></div>
                                    </div>
                                    <div className="col-sm-12 ml-1 advice-followup" style={{
                                        display: "grid",
                                        gridTemplateColumns: '8% 5% 5% 85%'
                                    }}>
                                            <div><label className="pr-1">Follow up after: </label></div>
                                            {followUp ?
                                                <div>
                                                        <Form form={form} name="folloup" onBlur={onFollowupBlur}  >
                                                            <Form.Item
                                                                name="days"
                                                                rules={[
                                                                    {
                                                                        pattern: /^(?:\d*)$/,
                                                                        message: "Value should contain just positive number",
                                                                    }
                                                                ]}>
                                                            <Input maxLength="2"/>
                                                            </Form.Item>
                                                        </Form>
                                                </div>
                                                    : <label onClick={() => setFollowUp(true)}> {preFollowupDays && preFollowupDays > 0 ? preFollowupDays : 'N/A'} </label>
                                            }
                                            <div><label className="pl-1">Days </label></div>
                                    </div>
                                </div>
                            </List.Item>

                                {/*<List.Item>
                                    <div className="col-sm-12">
                                        <div className="col-sm-12" style={{display: "flex", justifyContent: "space-between", textTransform:"uppercase"}}>
                                            <div><strong>Advice</strong></div>
                                            <div>25/02/2021</div>
                                        </div>
                                        <div className="col-sm-12 ml-2">
                                            Avoid alcohol and cold food
                                        </div>
                                    </div>
                                </List.Item>*/}
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
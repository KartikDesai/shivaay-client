import React, {useEffect, useState} from 'react';
import SidebarLink from './SidebarLink';
import SidebarCategory from "./SidebarCategory";
import {connect} from "react-redux";

const sidebarContent = props => {

    const [adminMenus, setAdminMenus] = useState("");

    useEffect(() => {
        // TODO: check performance of number of calling
        // TODO: change the way permission checking happening
        if (!props.user.userInfo || !props.user.userInfo.roles || !props.user.userInfo.roles.length === 0) {
            return;
        }
        if (props.user.userInfo.roles.find( r => r.name === "ADMIN")) {
            setAdminMenus(
                <SidebarCategory title="Admin" icon="user">
                    <SidebarLink title="Configure Doctor" route="/admin/doctor"/>
                    <SidebarLink title="Configure Drug" route="/admin/drug" />
                    <SidebarLink title="Configure Chief Complaint"  route="/admin/chiefcomplaint" />
                </SidebarCategory>
            );
        }
    }, [props.user]);

    return (
        <div className="sidebar__content">
            <ul className="sidebar__block">
                {/*<SidebarLink title="Dashboard" icon="home" exact route="/"  />*/}
                <SidebarLink title="Appointments" icon="users" route="/appointments"/>
                {adminMenus}
            </ul>
            <ul className="sidebar__block">
                <SidebarLink title="Log Out" icon="exit" route="/logout"/>
            </ul>
        </div>
    );
}

export default connect(state => {
    return {
        user: state.user
    }})(sidebarContent);

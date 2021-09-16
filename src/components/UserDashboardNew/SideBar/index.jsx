import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import SideNav, {  NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser,faSignOutAlt,faAddressCard,faCommentDollar,faCommentsDollar,faTable} from '@fortawesome/free-solid-svg-icons'
import { useRouteMatch,useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import './index.css'

const SideBar = ({toggle,setToggle,userData,itemSelected,setItemSelected,haveInternal,setTransactionInfo}) => {

    const { t } = useTranslation();
    const { url } = useRouteMatch()
    let history = useHistory();

    const sideNavItemSelected=(selected)=>{
        if(selected==="logout"){
            sessionStorage.clear();
            history.push(`/`);
        }else if(selected==="internalTransaction"){
            history.push(`${url}/transactionRequest/0/1`);
        }else if(selected==="otherTransaction"){
            history.push(`${url}/transactionRequest/0/4`);
        }
        else if(selected!=="logout" && selected!=="userInformation" ){
            history.push(`${url}/${selected}`);
        }
        setItemSelected(selected)
        setTransactionInfo("notDoneYet")
    }

    return (
        <div>
            <SideNav style={{position:"fixed"}} expanded={toggle} className="secondaryColor"
                onSelect={(selected) => {
                    sideNavItemSelected(selected)
                }}
                onToggle={(toggle)=> {
                    setToggle(toggle);
                }}
            >
                <SideNav.Toggle />
                <SideNav.Nav>
                    <NavItem className="notHover" disabled>
                        <NavIcon>
                            <FontAwesomeIcon icon={faAddressCard} />
                        </NavIcon>
                        <NavText>
                            {`
                                ${userData.firstName===undefined ? "" : userData.firstName} 
                                ${userData.lastName===undefined ? "" : userData.lastName}
                            `}
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="Accounts" active={itemSelected==="Accounts"}>
                        <NavIcon>
                            <FontAwesomeIcon icon={faUser} />
                        </NavIcon>
                        <NavText>
                            {t("Accounts")}
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="movementsTable" active={itemSelected==="movementsTable"}>
                        <NavIcon>
                            <FontAwesomeIcon icon={faTable} />
                        </NavIcon>
                        <NavText>
                            {t("Movements Table")}
                        </NavText>
                    </NavItem>
                    <NavItem className={haveInternal ? "d-block" : "d-none"} eventKey="internalTransaction"  active={itemSelected==="internalTransaction"}>
                        <NavIcon>
                            <FontAwesomeIcon icon={faCommentDollar} />
                        </NavIcon>
                        <NavText>
                            {t("Internal transaction")}
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="otherTransaction" active={itemSelected==="otherTransaction"}>
                        <NavIcon>
                            <FontAwesomeIcon icon={faCommentsDollar} />
                        </NavIcon>
                        <NavText>
                            {t("Other transfers")}
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="logout">
                        <NavIcon>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </NavIcon>
                        <NavText>
                            {t("LogOut")}
                        </NavText>
                    </NavItem>
                </SideNav.Nav>                
            </SideNav>
        </div>
    )
}
export default SideBar

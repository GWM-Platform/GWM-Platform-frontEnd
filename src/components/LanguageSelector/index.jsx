import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Dropdown } from 'react-bootstrap'
import './index.css'
import "flag-icon-css/css/flag-icon.min.css"
const LanguageSelector = ({ selected, changeLanguage,languages }) => {
    

    const { t } = useTranslation();

    return (
        <Dropdown className="languageSelector">
            <Dropdown.Toggle
                variant="secondary btn-sm"
                className="bg-none"
                id="dropdown-basic">
                {selected === 0 ? <span className={`flag-icon flag-icon-${languages[0].code}`}></span> : <img src="https://raw.githubusercontent.com/MarcosParengo/assetsNbanking/master/2.png" alt="en" height="16px" style={{ verticalAlign: "sub" }} />}  {t(languages[selected].name)}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item active={selected === 0 ? true : false} onClick={() => changeLanguage(0)}>
                    <span className={`flag-icon flag-icon-${languages[0].code}`}></span> {t(languages[0].name)}
                </Dropdown.Item>
                <Dropdown.Item active={selected === 1 ? true : false} onClick={() => changeLanguage(1)}>
                    <img src="https://raw.githubusercontent.com/MarcosParengo/assetsNbanking/master/2.png" alt="en" height="16px" style={{ verticalAlign: "sub" }} /> {t(languages[1].name)}
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}
export default LanguageSelector

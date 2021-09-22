import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import i18n from '../I18n';
import { Dropdown } from 'react-bootstrap'
import './index.css'
import "flag-icon-css/css/flag-icon.min.css"
const LanguageSelector = () => {
    const [languages] = useState(
        [
            {
                "code": "es",
                "name": "Spanish"
            }, {
                "code": "gb",
                "name": "English"
            }
        ]);

        const [selected, setSelected] = useState(localStorage.getItem("language")===null ? 1 : languages.findIndex(x => x.code === localStorage.getItem("language")))    
        if(localStorage.getItem("language")===null){
            localStorage.setItem("language","gb")
        } 
    const { t } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(languages[language].code);
        setSelected(language)
        localStorage.setItem("language", languages[language].code);
    }

    return (
        <Dropdown >
            <Dropdown.Toggle
                variant="danger btn-sm"
                className="mainColor"
                id="dropdown-basic">
                {selected===0 ?  <span className={`flag-icon flag-icon-${languages[0].code}`}></span> : <img src="https://raw.githubusercontent.com/MarcosParengo/assetsNbanking/master/2.png" alt="en" height="16px" style={{verticalAlign:"sub"}}/>}  {t(languages[selected].name)}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item active={ selected===0 ? true : false } onClick={() => changeLanguage(0)}>
                    <span className={`flag-icon flag-icon-${languages[0].code}`}></span> {t(languages[0].name)}
                </Dropdown.Item>
                <Dropdown.Item active={ selected===1 ? true : false } onClick={() => changeLanguage(1)}>
                    <img src="https://raw.githubusercontent.com/MarcosParengo/assetsNbanking/master/2.png" alt="en" height="16px" style={{verticalAlign:"sub"}}/> {t(languages[1].name)}
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}
export default LanguageSelector

import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Dropdown } from 'react-bootstrap'
import './index.css'
import "flag-icon-css/css/flag-icon.min.css"
const LanguageSelector = () => {
    const { t, i18n } = useTranslation();

    const lngs = {
        en: { nativeName: 'English' },
        es: { nativeName: 'Spanish' }
    };

    const [selected, setSelected] = useState(localStorage.getItem("language") ? localStorage.getItem("language") : "es")

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        setSelected(language)
        localStorage.setItem("language", language);
    }

    return (
        <Dropdown className="languageSelector">
            <Dropdown.Toggle
                variant="secondary btn-sm"
                className="bg-none"
                id="dropdown-basic">
                {
                    selected === "en" ?
                        <img src={process.env.PUBLIC_URL + '/images/englishFlag.png'} alt="en" height="16px" style={{ verticalAlign: "sub" }} />
                        :
                        <span className={`flag-icon flag-icon-${selected}`}></span>
                }
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {
                    Object.keys(lngs).map((lng) => {
                        return (
                            <Dropdown.Item key={lng} active={selected === lng} onClick={() => changeLanguage(lng)}>
                                {
                                    lng === "en" ?
                                        <img src={process.env.PUBLIC_URL + '/images/englishFlag.png'} alt="en" height="16px" style={{ verticalAlign: "sub" }} />

                                        :
                                        <span className={`flag-icon flag-icon-${lng}`}></span>
                                }
                                &nbsp;{t(lngs[lng].nativeName)}
                            </Dropdown.Item>
                        )
                    })
                }
            </Dropdown.Menu>
        </Dropdown >


    )
}
export default LanguageSelector

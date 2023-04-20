import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import i18n from 'components/I18n';
import { Dropdown } from 'react-bootstrap'
import './index.scss'
import Es from './flags/es.jsx'
import En from './flags/en.jsx'

const LanguageSelector = () => {
    const { t } = useTranslation();

    const lngs = {
        en: { nativeName: 'English' },
        es: { nativeName: 'Spanish' }
    };

    const [selected, setSelected] = useState(localStorage.getItem("language") ? localStorage.getItem("language") : "en")

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        document.documentElement.setAttribute('lang', language)
        localStorage.setItem("language", language);
    }

    const languageIsValid = (language) => Object.keys(lngs).includes(language)


    useEffect(() => {
        const languageIsValid = (language) => Object.keys(lngs).includes(language)

        const lngs = {
            en: { nativeName: 'English' },
            es: { nativeName: 'Spanish' }
        };

        if (languageIsValid(selected)) {
            changeLanguage(selected)
        } else {
            setSelected("en")
            localStorage.setItem("language", "en");
        }
    }, [selected])

    return (
        <Dropdown className="languageSelector">
            <Dropdown.Toggle
                variant="secondary btn-sm"
                className="bg-none"
                id="dropdown-language">
                {
                    selected === "es" ?
                        <Es /> :
                        <En />
                }
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {
                    Object.keys(lngs).map((lng) => {
                        return (
                            <Dropdown.Item key={lng} active={selected === lng} onClick={() => { setSelected(lng); changeLanguage(lng) }}>
                                {
                                    languageIsValid(lng) ?
                                        lng === "es" ?
                                            <Es /> :
                                            <En />
                                        :
                                        <En />
                                }
                                <span className="d-none">
                                    &nbsp;{languageIsValid(lng) ? t(lngs[lng].nativeName) : ""}
                                </span>
                            </Dropdown.Item>
                        )
                    })
                }
            </Dropdown.Menu>
        </Dropdown >


    )
}
export default LanguageSelector

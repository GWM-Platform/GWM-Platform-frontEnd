import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import FormattedNumber from "components/DashBoard/GeneralUse/FormattedNumber";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const GeneralInfo = () => {
    const { t } = useTranslation()

    const [fullSettlement, setFullSettlement] = useState({ fetching: false, amount: 0 })

    const [showClick, setShowClick] = useState(false)
    const [showHover, setShowHover] = useState(false)



    useEffect(() => {
        const getDocuments = () => {
            setFullSettlement((prevState) => ({ ...prevState, fetching: true }))

            axios.get(`/clients/APL`, {
                signal: signal,
            }).then(function (response) {
                setFullSettlement((prevState) => (
                    {
                        ...prevState,
                        fetching: false,
                        amount: response?.data || 0,
                    }))
            }).catch((err) => {
                if (err.message !== "canceled") {
                    setFullSettlement((prevState) => (
                        {
                            ...prevState,
                            fetching: false,
                            amount: 0,
                        }))
                }
            });
        };

        const controller = new AbortController();
        const signal = controller.signal;
        getDocuments(signal)

        return () => {
            controller.abort();
        };
        //eslint-disable-next-line
    }, [])

    return (
        <div className="general-info box-shadow">
            <h1 className="mt-0">
                {t("APL")}
            </h1>
            <h6 className="mb-0">
                {t("Full Settlement")}
                <OverlayTrigger
                    show={showClick || showHover}
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    popperConfig={{
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, 0],
                                },
                            },
                        ],
                    }}
                    overlay={
                        <Tooltip className="mailTooltip" id="more-units-tooltip">
                            {t("Holding in current accounts")} +
                            <br />
                            {t("Holding in fixed terms")}
                        </Tooltip>
                    }
                >
                    <span>
                        <button
                            onBlur={() => setShowClick(false)}
                            onClick={() => setShowClick(prevState => !prevState)}
                            onMouseEnter={() => setShowHover(true)}
                            onMouseLeave={() => setShowHover(false)}
                            type="button" className="noStyle"  ><FontAwesomeIcon icon={faInfoCircle} /></button>
                    </span>
                </OverlayTrigger>
            </h6>
            <h4 className="mt-0">
                {
                    fullSettlement.fetching ?
                        <Spinner animation="border" size="sm" />
                        :
                        <FormattedNumber value={fullSettlement?.amount} prefix="U$D " fixedDecimals={2} />
                }
            </h4>
        </div>
    );
}

export default GeneralInfo
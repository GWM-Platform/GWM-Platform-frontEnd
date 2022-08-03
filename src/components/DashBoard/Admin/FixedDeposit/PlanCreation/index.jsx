import axios from "axios";
import { DashBoardContext } from "context/DashBoardContext";
import React, { useContext, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const PlanCreation = ({ getFixedDepositPlans }) => {
    const { toLogin } = useContext(DashBoardContext)

    const { t } = useTranslation()

    const [Creation, setCreation] = useState({ fetching: false, fetched: false, valid: false })

    const CreateFixedDeposit = () => {
        setCreation(prevState => ({
            ...prevState,
            fetching: true,
            fetched: false,
            valid: true
        }))
        axios.post(`/fixed-deposits/plans`, {
            interest: {},
            name: "Time deposit"
        }
        ).then(function (response) {
            if (response.status < 300 && response.status >= 200) {
                setCreation(prevState => ({
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true
                }))
                getFixedDepositPlans()
            } else {
                switch (response.status) {
                    case 401:
                        toLogin();
                        break;
                    default:
                        setCreation(prevState => ({
                            ...prevState,
                            fetching: false,
                            fetched: true,
                            valid: false
                        }))
                        break;
                }
            }
        }).catch((err) => {
            if (err.message !== "canceled") {
                setCreation(prevState => ({
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: false
                }))
            }
        });
    }

    return (
        <div className="d-flex align-items-center justify-content-center flex-column" style={{ height: "50vh" }}>
            <h1 style={{ maxWidth: "25ch", textAlign: "center" }}>{t("Apparently, there is no time deposit plan created")}</h1>
            <Button className="mt-3" disabled={Creation.fetching} onClick={() => CreateFixedDeposit()}>
                {t("Create one")}
                {
                    !!(Creation.fetching) &&
                    <Spinner animation="border" size="sm" className="ms-2" />
                }
            </Button>
        </div>
    );
}

export default PlanCreation
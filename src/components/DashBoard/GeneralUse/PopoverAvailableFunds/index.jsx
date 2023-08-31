import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useTranslation } from "react-i18next";
import { Popover } from 'react-bootstrap';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';


const PopoverAvailableFunds = React.forwardRef(
    ({ account, popper, show: _, ...props }, ref) => {

        const { t } = useTranslation()

        return (
            <Popover id="popover-overview-own-funds" {...props} ref={ref} >
                <Popover.Header>{t("Available funds overview")}</Popover.Header>
                <Popover.Body className="pt-1 pb-2">
                    {t("Own funds")}:&nbsp;
                    <span className="bolder" style={{ color: "rgb(105, 105, 105)" }}>
                        <FormattedNumber value={account.ownFunds} prefix="U$D " fixedDecimals={2} />
                    </span><br />
                    {t("Available overdraft")}:&nbsp;
                    <span className="bolder" style={{ color: "rgb(105, 105, 105)" }}>
                        <FormattedNumber value={account.overdraftAvailable} prefix="U$D " fixedDecimals={2} />
                    </span><br />
                    {
                        account.owed !== 0 &&
                        <>
                            {t("Owed")}:&nbsp;
                            <span className="bolder" style={{ color: "rgb(105, 105, 105)" }}>
                                <FormattedNumber value={account.owed} prefix="U$D " fixedDecimals={2} />
                            </span>
                        </>
                    }
                </Popover.Body>
            </Popover>
        )
    })

export default PopoverAvailableFunds
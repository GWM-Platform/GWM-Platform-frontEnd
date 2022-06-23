import React from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const MoreAndLess = ({ InScreen, total, setOptions }) => {

    const { t } = useTranslation();

    const showLess = (amount) => {
        setOptions(prevState => ({ ...prevState, ...{ take: prevState.take - amount } }))
    }

    const showMore = (amount) => {
        setOptions(prevState => ({ ...prevState, ...{ take: prevState.take + amount } }))
    }

    return (
        <div className="d-flex justify-content-between p-1">
            <Button className="ps-0" disabled={total <= 5 || 5 >= InScreen}
                onClick={() => showLess(5)} variant="link">{t("Show less")}</Button>

            <Button className="pe-0" disabled={total < InScreen}
                onClick={() => showMore(5)} variant="link">{t("Show more")}</Button>
        </div>
    )
}

export default MoreAndLess
import React from "react";
import { useTranslation } from "react-i18next";

const RotateDevice = () => {
    const { t } = useTranslation()
    return (
        <div className="RotateDevice">
            {t("Please Rotate your device to use the platform")}
        </div>
    );
}

export default RotateDevice
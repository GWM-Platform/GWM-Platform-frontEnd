import { fetchPerformance, selectPerformanceById } from "Slices/DashboardUtilities/performancesSlice";
import { DashBoardContext } from "context/DashBoardContext";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Form, Placeholder } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import FormattedNumber from "../FormattedNumber";

const PerformanceComponent = ({ text, fundId = "", fixedDepositId = "", withoutSelector = false, className = "", setValueExternal = false, valueExternal = false, clientId = false, textAlign = "text-start", numberFw = "" }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch()
    const { ClientSelected } = useContext(DashBoardContext)
    const [valueInternal, setValueInternal] = useState("")

    const value = useMemo(() => valueExternal !== false ? valueExternal : valueInternal, [valueExternal, valueInternal])
    const setValue = useCallback((params) => setValueExternal !== false ? setValueExternal(params) : setValueInternal(params), [setValueExternal])

    const performanceObject = useSelector(state =>
        selectPerformanceById(
            state,
            fixedDepositId !== "" ?
                `fixedDeposit`
                :
                (fundId !== "" ? fundId : "totalPerformance"),
            value
        )
    )

    const status = performanceObject?.status
    const performance = performanceObject?.performance

    useEffect(() => {
        dispatch(fetchPerformance({
            ...fixedDepositId !== "" ?
                { fixedDepositId: fixedDepositId }
                :
                (fundId !== "" ? { fund: fundId } : { totalPerformance: true }),
            ...value !== "" ? { year: value } : {},
            clientId: clientId || ClientSelected?.id
        }))
    }, [fundId, fixedDepositId, ClientSelected, dispatch, value, clientId])

    const yearsArraySince = (initialYear = 2022) => {
        const años = [];
        const currentYear = moment().year();
        for (let year = currentYear; year >= initialYear; year--) {
            años.push(year);
        }
        return años;
    }
    return (
        <span className={`${textAlign} w-100 d-block ${className}`} style={{ fontWeight: "300" }}>
            <span className="text-nowrap">
                {t(text)}
                {
                    !withoutSelector &&
                    <span>
                        <Form.Select className='inline-selector ms-2' onChange={e => setValue(e.target.value)} value={value} id="type">
                            <option value="">{t("General")}</option>
                            {
                                yearsArraySince(2022).map(year => (
                                    <option value={year} key={year}>{year}</option>
                                ))
                            }
                        </Form.Select>
                    </span>
                }
                :&nbsp;
            </span>
            {
                status === "loading" && (performance === null || performance === undefined) ?
                    <Placeholder style={{ width: "8ch" }} animation="wave" className="placeholder" />
                    :
                    <strong className={`text-nowrap ${numberFw}`}>
                        <FormattedNumber className={{
                            '1': 'text-green',
                            '-1': 'text-red'
                        }[Math.sign(performance)]}
                            value={performance} prefix="U$D " fixedDecimals={2} />
                    </strong>
            }
        </span>
    )
}
export default PerformanceComponent
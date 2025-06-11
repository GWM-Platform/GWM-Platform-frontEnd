import { fetchPerformance, selectPerformanceById } from "Slices/DashboardUtilities/performancesSlice";
import { DashBoardContext } from "context/DashBoardContext";
import moment, { min } from "moment";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Form, Placeholder } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FormattedNumberWithHidden } from "components/DashBoard/NavBars/NavBarTotal";
export const yearsArraySince = (initialYear = 2022, lastYear = moment().year()) => {
    const años = [];
    for (let year = lastYear; year >= initialYear; year--) {
        años.push(year);
    }
    return años;
}
const PerformanceComponent = ({ text, fundId = "", fixedDepositId = "", withoutSelector = false, className = "", setValueExternal = false, valueExternal = false, clientId = false, textAlign = "text-start", numberFw = "", monthValueExternal = false, setMonthValueExternal = false }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch()
    const { ClientSelected } = useContext(DashBoardContext)
    const [valueInternal, setValueInternal] = useState("")
    const [monthValueInternal, setMonthValueInternal] = useState("")

    const value = useMemo(() => valueExternal !== false ? valueExternal : valueInternal, [valueExternal, valueInternal])
    const setValue = useCallback((params) => setValueExternal !== false ? setValueExternal(params) : setValueInternal(params), [setValueExternal])

    const monthValue = useMemo(() => monthValueExternal !== false ? monthValueExternal : monthValueInternal, [monthValueExternal, monthValueInternal])
    const setMonthValue = useCallback((params) => setMonthValueExternal !== false ? setMonthValueExternal(params) : setMonthValueInternal(params), [setMonthValueExternal])

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
            ...monthValue !== "" ? { month: monthValue } : {},
            clientId: clientId || ClientSelected?.id
        }))
    }, [fundId, fixedDepositId, ClientSelected, dispatch, value, clientId, monthValue])



    // null for not setted, moment for setted, false if not allowed
    const minMonthForFunds = moment().set("year", 2024).set("month", 0).startOf("month")
    const minMonthForFixedDeposits = null

    // lower date between funds and fixed deposits (check if fixed deposits is null, if it is, it will return funds date if it isnt null)
    const minMonthGeneral = ((minMonthForFunds === false) || (minMonthForFixedDeposits === false)) ? false : (minMonthForFixedDeposits === null ? minMonthForFunds : (minMonthForFunds === null ? minMonthForFixedDeposits : min(minMonthForFunds, minMonthForFixedDeposits)))

    const currentModeMinMonth = useMemo(() => {
        if (fundId !== "") {
            return minMonthForFunds
        } else if (fixedDepositId !== "") {
            return minMonthForFixedDeposits
        } else {
            return minMonthGeneral
        }
    }, [fundId, fixedDepositId, minMonthForFunds, minMonthGeneral])

    // genera el array con los nombres de los meses, hasta el mes corriente si value es igual al año corriente
    const months = moment.months().slice(currentModeMinMonth === null || currentModeMinMonth === false ? 0 : currentModeMinMonth.get("month"), (value === moment().year() + "") ? moment().month() + 1 : 12)

    // if year is selected (value)
    // based on modes (fund mode if !== "", fixed deposit mode if !== "" or general if === "" and fixedDepositId === "")
    // if value is after minMonth for each mode, it will show the month selector
    const showMonthSelector = useMemo(() => {
        if (value && currentModeMinMonth !== false) {
            return currentModeMinMonth === null ? true : moment(`${value}-12`).isAfter(currentModeMinMonth)
        } else {
            return false;
        }
    }, [currentModeMinMonth, value]);


    return (
        <span className={`${textAlign} w-100 d-block ${className}`} style={{ fontWeight: "300" }}>
            <span className="text-nowrap">
                {t(text)}
                {
                    !withoutSelector &&
                    <span>
                        <Form.Select className='inline-selector ms-2' onChange={e => {
                            setValue(e.target.value)
                            setMonthValue("")
                        }} value={value} id="year">
                            <option value="">{t("Acumulated")}</option>
                            {
                                yearsArraySince(2022).map(year => (
                                    <option value={year} key={year}>{year}</option>
                                ))
                            }
                        </Form.Select>

                        {
                            showMonthSelector &&
                            <Form.Select
                                style={{ textTransform: "capitalize" }} className='inline-selector ms-2'
                                onChange={e => setMonthValue(e.target.value)} value={monthValue} id="month"
                            >
                                <option value="">{t("Total")}</option>
                                {

                                    months.map((month, index) => (
                                        <option value={index} key={index} style={{ textTransform: "capitalize" }}>{month}</option>
                                    ))
                                }
                            </Form.Select>
                        }
                    </span>
                }
                :&nbsp;
            </span>
            {
                status === "loading" && (performance === null || performance === undefined) ?
                    <Placeholder style={{ width: "8ch" }} animation="wave" className="placeholder" />
                    :
                    <strong className={`text-nowrap ${numberFw}`}>
                        <FormattedNumberWithHidden className={{
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
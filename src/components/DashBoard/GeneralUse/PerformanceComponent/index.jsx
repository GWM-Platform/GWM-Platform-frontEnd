import { fetchPerformance, selectPerformanceById } from "Slices/DashboardUtilities/performancesSlice";
import { DashBoardContext } from "context/DashBoardContext";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import FormattedNumber from "../FormattedNumber";

const PerformanceComponent = ({ text, fundId = "", withoutSelector = false }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch()
    const { ClientSelected } = useContext(DashBoardContext)
    const [value, setValue] = useState("")

    const performanceObject = useSelector(state => selectPerformanceById(state, fundId === "" ? "totalPerformance" : fundId))
    const status = performanceObject?.status
    const performance = performanceObject?.performance

    useEffect(() => {
        dispatch(fetchPerformance({
            ...fundId !== "" ? { fund: fundId } : { totalPerformance: true },
            ...value !== "" ? { year: value } : {},
            clientId: ClientSelected?.id
        }))
    }, [fundId, ClientSelected, dispatch, value])

    return (
        <span className='text-start w-100 d-block' style={{ fontWeight: "300" }}>
            <span className="text-nowrap">
                {t(text)}
                {
                    !withoutSelector &&
                    <span>
                        <Form.Select className='inline-selector ms-2' onChange={e => setValue(e.target.value)} value={value} id="type">
                            <option value="">{t("General")}</option>
                            <option value={moment().format("Y")} >{moment().format("Y")}</option>
                            <option value={moment().subtract(1, "year").format("Y")} >{moment().subtract(1, "year").format("Y")}</option>
                        </Form.Select>
                    </span>
                }
                :&nbsp;
            </span>
            {
                status === "loading" ?
                    <Spinner size="sm" className="me-2" animation="border" variant="primary" />
                    :
                    <strong className="text-nowrap">
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
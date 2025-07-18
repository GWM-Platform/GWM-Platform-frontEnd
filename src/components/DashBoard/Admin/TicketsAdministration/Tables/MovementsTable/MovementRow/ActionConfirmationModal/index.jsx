import React, { useEffect, useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation, faCheck, faTimes, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import CurrencyInput from '@osdiab/react-currency-input-field';
import { unMaskNumber } from 'utils/unmask';
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { customFetch } from 'utils/customFetch';
import { Autocomplete, TextField } from '@mui/material';

const ActionConfirmationModal = ({ movement, setShowModal, action, show, reloadData }) => {
    const { t } = useTranslation();
    const [ActionFetch, setActionFetch] = useState({ fetched: false, fetching: false, valid: false })

    const [NoteActive, setNoteActive] = useState(false)

    const [data, setData] = useState({ note: "", amount: "" })
    const defaultValue = useMemo(() => Decimal(movement?.amount || 0).abs().toFixed(2), [movement?.amount])

    // Liquidation method options in English
    const liquidationOptions = [
        "Cash dollars center",
        "Cash pesos center",
        "Cash pesos vicente lopez",
        "Cash dollars vicente lopez",
        "Transfer pesos argentina",
        "Transfer dollars argentina",
        "Transfer USA chase",
        "Transfer USA BAC"
    ];

    useEffect(() => {
        setData(prevState => ({ ...prevState, amount: defaultValue }))
    }, [defaultValue])
    const shouldPartialLiquidate = useMemo(() => action === "liquidate" && !(Decimal(defaultValue).eq(data.amount || 0)), [action, data.amount, defaultValue])

    const handleChange = (event) => {
        let aux = data;
        aux[event.target.id] = event.target.value;
        setData(prevState => ({ ...prevState, ...aux }));
    }

    const handleClose = () => {
        setActionFetch({
            ...ActionFetch,
            fetching: false,
            fetched: false,
            valid: false
        })
        setShowModal(false)
    }

    const changeTransactionState = async () => {
        setActionFetch({
            ...ActionFetch,
            fetching: true,
            fetched: false,
            valid: false
        })

        const url = `${process.env.REACT_APP_APIURL}/movements/${movement.id}/${shouldPartialLiquidate ? "partialLiquidate" : action}`;
        const token = sessionStorage.getItem("access_token")

        const response = await customFetch(url, {
            method: 'POST',
            body: JSON.stringify({
                ...data.note !== "" ? {
                    [action === "deny" ? "denialMotive" : "comment"]: (data.note !== "" ? data.note : null)
                } : {},
                ...shouldPartialLiquidate ? { amount: data.amount } : {}
            }),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status >= 200 && response.status < 300) {
            setActionFetch({
                ...ActionFetch,
                fetching: false,
                fetched: true,
                valid: true
            })
        } else {
            setActionFetch({
                ...ActionFetch,
                fetching: false,
                fetched: true,
                valid: false
            })
            switch (response.status) {
                default:
                    console.error(response.status)
            }
        }
    }

    const inputValid = useMemo(() => {
        return Decimal(data.amount || 0).gt(0) && Decimal(data.amount || 0).lte(defaultValue)
    }, [data.amount, defaultValue])

    const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'
    const groupSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? ','

    const handleAmountChange = (value, name) => {
        const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'

        let fixedValue = value || ""
        if (value) {
            let lastCharacter = value.slice(-1)
            if (lastCharacter === decimalSeparator) {
                fixedValue = value.slice(0, -1)
            }
        }
        const unMaskedValue = unMaskNumber({ value: fixedValue || "" })

        handleChange({
            target:
                { id: name ? name : 'amount', value: unMaskedValue }
        })
    }

    return (
        <Modal className="deleteModal" size="sm" show={show} onHide={handleClose}>
            <Modal.Body className="body">
                <div className={`action-status ${ActionFetch.fetched && !ActionFetch.fetching ? "show" : "hidden"}`}>
                    {
                        ActionFetch.valid ?
                            <>
                                <div className="d-flex justify-content-center align-items-center">
                                    <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                                        <FontAwesomeIcon
                                            className="p-absolute"
                                            color="green"
                                            icon={faCheck}
                                            style={{
                                                transform: "translate(-50%, -50%)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon

                                            color="green"
                                            icon={faCircle}
                                            className="p-absolute"
                                            style={{
                                                transform: "translate(-50%, -50%) scale(1.5)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                                    </h1>
                                </div>
                                <h2 className="subTitle mt-4">{t("The ticket has been")} {t(action === "approve" ? "approved" : action === "liquidate" ? "liquidated" : "denied")} {t("succesfully")}</h2>
                            </>
                            :
                            <>
                                <div className="d-flex justify-content-center align-items-center">
                                    <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                                        <FontAwesomeIcon
                                            className="p-absolute"
                                            color="red"
                                            icon={faTimes}
                                            style={{
                                                transform: "translate(-50%, -50%)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon

                                            color="red"
                                            icon={faCircle}
                                            className="p-absolute"
                                            style={{
                                                transform: "translate(-50%, -50%) scale(1.5)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                                    </h1>
                                </div>
                                <h2 className="subTitle mt-4">{t("Failed to")}{" "}{t(action)}{" "}{t("the ticket")}</h2>
                            </>
                    }
                </div>
                <div className={`esqueleton ${!ActionFetch.fetched && !ActionFetch.fetching ? "show" : "hidden"}`}>
                    <div className="d-flex justify-content-center align-items-center">
                        <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                            <FontAwesomeIcon
                                className="p-absolute"
                                color="red"
                                icon={faExclamation}
                                style={{
                                    transform: "translate(-50%, -50%)",
                                    top: "50%",
                                    left: "50%"
                                }}
                            />
                            <FontAwesomeIcon

                                color="red"
                                icon={faCircle}
                                className="p-absolute"
                                style={{
                                    transform: "translate(-50%, -50%) scale(1.5)",
                                    top: "50%",
                                    left: "50%"
                                }}
                            />
                            <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                        </h1>
                    </div>
                    <h1 className="title"> {t("Are you sure?")}</h1>
                    <h2 className="subTitle">{t("You are about to")} {t(action)} {t("the ticket with the id")} {movement.id}</h2>
                    <h3 className="heading">{t("This action cannot be undone")}</h3>
                    {
                        action === "liquidate" &&
                        <div className='px-3 mb-3' key={movement?.id}>
                            <Form.Label className='fw-light'>{t("Amount to be liquidated")}</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>U$D</InputGroup.Text>
                                {/*Shown input formatted*/}
                                <CurrencyInput
                                    allowNegativeValue={false}
                                    name="currencyInput"
                                    defaultValue={data.amount}
                                    decimalsLimit={2}
                                    decimalSeparator={decimalSeparator}
                                    groupSeparator={groupSeparator}
                                    onValueChange={(value, name) => handleAmountChange(value)}
                                    className={`form-control ${inputValid ? 'hardcoded-valid' : 'hardcoded-invalid'}  `}
                                />
                            </InputGroup>

                            <Form.Text className={inputValid ? '' : 'text-danger'}>
                                {t("The maximum amount is")} <FormattedNumber value={defaultValue} prefix="U$D " fixedDecimals={2} />
                            </Form.Text>

                        </div>
                    }
                    {
                        (action === "deny" || action === "liquidate") &&
                        <div className={`px-3 mt-3 `}>
                            {
                                NoteActive ?
                                    <div className="d-flex align-items-center">
                                        {action === "liquidate" ? (
                                            <Autocomplete
                                                freeSolo
                                                options={liquidationOptions}
                                                getOptionLabel={(option) => t(option)}
                                                value={data.note}
                                                onChange={(event, newValue) => {
                                                    handleChange({ target: { id: "note", value: newValue || "" } });
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    handleChange({ target: { id: "note", value: newInputValue || "" } });
                                                }}
                                                sx={{
                                                    "&": {
                                                        flexGrow: 1,
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder={t("Note")}
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            flexGrow: 1,
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '0.375rem',
                                                                '& fieldset': {
                                                                    borderColor: '#ced4da',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: '#86b7fe',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#86b7fe',
                                                                    borderWidth: '1px'
                                                                },
                                                            },
                                                            '& .MuiInputBase-input': {
                                                                padding: '8.5px 14px',
                                                                fontSize: '1rem',
                                                                fontFamily: 'inherit'
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        ) : (
                                            <Form.Control
                                                placeholder={t(action === "deny" ? "Denial motive" : "Note")} required
                                                value={data.note} type="text" id="note" maxLength="250"
                                                onChange={(e) => { handleChange(e); }}
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={
                                                () => {
                                                    handleChange({ target: { id: "note", value: "" } })
                                                    setNoteActive(false)
                                                }
                                            }
                                            className="noStyle ms-2" title={t("Remove note")}>
                                            <FontAwesomeIcon icon={faMinusCircle} />
                                        </button>
                                    </div>
                                    :
                                    <div style={{ height: "38px" }} className="w-100 d-flex align-items-start">
                                        <Button type="button" className="ms-auto" size="sm" variant="danger" onClick={() => setNoteActive(true)}>
                                            <FontAwesomeIcon className="me-1" icon={faPlusCircle} />
                                            {t("Add note")}
                                        </Button>
                                    </div>
                            }
                        </div>
                    }
                </div>

            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                {
                    ActionFetch.fetched ?
                        <Button variant="outline-secondary" onClick={() => { reloadData(); handleClose() }}>
                            {t("Close")}
                        </Button>
                        :
                        <>

                            <Button variant="outline-secondary" onClick={() => handleClose()}>
                                {t("Cancel")}
                            </Button>
                            <Button disabled={action === "liquidate" && !inputValid} variant="outline-success" onClick={() => { if (!ActionFetch.fetching) changeTransactionState() }}>
                                <div className="iconContainer green">
                                    {t("Confirm")}
                                </div>
                            </Button>
                        </>
                }

            </Modal.Footer>
        </Modal>
    )
}
export default ActionConfirmationModal

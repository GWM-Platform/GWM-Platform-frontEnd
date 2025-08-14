import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import { useRef } from 'react';
import { components } from "react-select";
import Select from "react-select";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import './index.scss'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { ModalPreview } from './ModalPreview';
import { useDispatch, useSelector } from 'react-redux';
import { fetchusers, selectAllusers } from 'Slices/DashboardUtilities/usersSlice';
import { fetchclients, selectAllclients } from 'Slices/DashboardUtilities/clientsSlice';
import { EditorTipTap } from './EditorTipTap';
import { fetchFundsWithUsers, selectAllFundsWithUsers } from 'Slices/DashboardUtilities/fundsWithUsersSlice';
import TooltipInfo from './TooltipInfo';

const maxClients = 45
const Broadcast = () => {
    // console.log(process.env.REACT_APP_FLICKR_KEY,process.env.REACT_APP_FLICKR_KEYFLICKR_SECRET)

    const { toLogin, DashboardToastDispatch } = useContext(DashBoardContext)

    const maximumReached = useCallback(
        () => {
            DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "Maximum number of recipents reached" } })
        }, [DashboardToastDispatch]
    )

    const { t } = useTranslation();

    const emailBodyDefaultState = "<p><br></p>"
    const [formData, setFormData] = useState(
        {
            title: "",
            emailBody: emailBodyDefaultState,
        }
    )

    const [selectedOptions, setSelectedOptions] = useState([])

    const [message, setMessage] = useState()
    const dispatch = useDispatch()

    const users = useSelector(selectAllusers)
    useEffect(() => {
        dispatch(fetchusers({ all: true }))
    }, [dispatch])

    const fundsWithUsersStatus = useSelector(state => state.fundsWithUsers.status)
    // TODO: Not include users disabled or that has funds but with a userToClient disabled
    const fundsWithUsers = useSelector(selectAllFundsWithUsers)
    useEffect(() => {
        if (fundsWithUsersStatus === 'idle') {
            dispatch(fetchFundsWithUsers())
        }
    }, [dispatch, fundsWithUsersStatus])

    const getUserById = useCallback((id) => users.find(user => user.id === id), [users])

    const clientStatus = useSelector(state => state.clients.status)
    const Clients = useSelector(selectAllclients)

    const clients = useMemo(() => Clients.filter(client => client.enabled).map(client => ({
        ...client, users: client?.users?.filter(userToClient => {
            return getUserById(userToClient?.userId)?.enabled && userToClient.enabled
        })
    })), [Clients, getUserById])

    const [validated, setValidated] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const handleChange = (event) => {
        setFormData(prevState => ({ ...prevState, [event?.target?.id]: event?.target?.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() && !buttonDisabled && formData.emailBody !== emailBodyDefaultState) {
            broadcast()
        }
        setValidated(true);
    }
    const emailBodyWihtImagesStyles = useCallback(
        () => {
            let toClients = false
            let parser = new DOMParser();
            let doc = parser.parseFromString(formData.emailBody, "text/html");
            let images = doc.querySelectorAll('img');
            images.forEach(img => {
                img.style.width = '100%';
                img.style.display = 'block';
            });
            // get elements with data-text-interpolation-type atribute
            let textInterpolationElements = doc.querySelectorAll('[data-text-interpolation-type]');
            textInterpolationElements.forEach(element => {
                // get the text interpolation type

                let keyword = element.getAttribute('data-text-interpolation-type')
                // replace the element with the tag keyword like <span data-text-interpolation-type="keyword">text</span> => {{keyword}}
                let span = doc.createElement('span');
                span.textContent = `{{${keyword}}}`
                element.replaceWith(span)
                if (keyword !== "username" && !keyword.includes("share_price_fund")) {
                    toClients = true
                }
            });
            return [new XMLSerializer().serializeToString(doc), toClients]
        }, [formData.emailBody])

    const broadcast = async () => {
        setMessage("")
        setButtonDisabled(true)
        const formDataSubmit = new FormData()

        const files = filesInput.current.files

        for (var i = 0; i < files?.length; i++) {
            formDataSubmit.append("files", files[i])
        }

        let receivers = selectedOptions.map(receiver => receiver.email)
        formDataSubmit.append("receivers", receivers)

        formDataSubmit.append("title", formData.title)
        const [emailBody, toClients] = emailBodyWihtImagesStyles()
        formDataSubmit.append("emailBody", emailBody)
        formDataSubmit.append("sendToClients", toClients)
        axios.post(`/users/broadcast`, formDataSubmit)
            .then(function (response) {
                setMessage("The broadcast was successfully sent")
                setButtonDisabled(false)
            })
            .catch((err) => {
                if (err.message !== "canceled") {
                    setButtonDisabled(false)
                    if (err.response.status === 401) toLogin()
                    console.log(err.response.status)
                    if (err.response.status === 500) {
                        setMessage("Server error. Try it again later")
                    } else {
                        setMessage("Error. Verify the entered data")
                    }
                }
            });
    }


    useEffect(() => {
        dispatch(fetchclients({ all: true, showUsers: true }))
    }, [dispatch])


    const filesInput = useRef(null)

    var allSelectedArray = [{ label: "All clients", value: "*" }]

    for (let client of clients) {
        let appendToArray = []
        appendToArray = (client.users || []).map(
            userToClient => ({ value: userToClient?.user?.email, label: userToClient?.user?.email, email: userToClient?.user?.email })
        ).filter(
            //eslint-disable-next-line 
            selectedOption => allSelectedArray.filter(
                selectedOptionFilter => selectedOptionFilter.value === selectedOption.value
            )?.length === 0)
        allSelectedArray = [...allSelectedArray, ...appendToArray]
    }

    var allOwnersArray = [{ label: "Owners", value: "*owners" }]
    for (let client of clients) {
        let appendToArray = []
        appendToArray = ([...client?.users || []]).filter(user => user?.isOwner).map(
            userToClient => ({ value: userToClient?.user?.email, label: userToClient?.user?.email, email: userToClient?.user?.email })
        ).filter(
            //eslint-disable-next-line 
            selectedOption => allOwnersArray.filter(
                selectedOptionFilter => selectedOptionFilter.value === selectedOption.value
            )?.length === 0)
        allOwnersArray = [...allOwnersArray, ...appendToArray]
    }

    const handleChangeMultiSelect = (selectedOptionInitial) => {
        const selectedFund = selectedOptionInitial.find(option => option.isFund)
        let selectedFundUsers = []
        let isFundSelected = selectedFund && allSelectedFund(selectedFund.value)
        if (selectedFund) {
            selectedFundUsers = fundsWithUsers?.find(fund => (fund.fundId + "") === selectedFund.value)
                ?.users?.map(user => transfromUser(users.find(userComplete => userComplete.email === user.email))) || []
        }

        const selectedOption = [
            ...selectedOptionInitial.filter(option => !option.isFund && (!isFundSelected || !selectedFundUsers.find(user => user.email === option.email))),
            ...selectedFund ? selectedFundUsers.filter(user => user && !selectedOptionInitial.find(selectedOption => selectedOption.email === user.email)) : []
        ]

        setSelectedOptions(prevState => {
            const previouslyAllSelected = prevState?.filter(option => option?.value === "*")?.length > 0
            const actuallyAllSelected = selectedOption?.filter(option => option?.value === "*")?.length > 0

            const previouslyOwnersSelected = prevState?.filter(option => option?.value === "*owners")?.length > 0
            const actuallyOwnersSelected = selectedOption?.filter(option => option?.value === "*owners")?.length > 0

            if (!previouslyOwnersSelected && actuallyOwnersSelected) {
                return ([...allOwnersArray])
            } else {
                if (previouslyOwnersSelected && !actuallyOwnersSelected) {
                    return ([])
                } else {
                    if (previouslyOwnersSelected && actuallyOwnersSelected) {
                        return ([...selectedOption.filter(selectedOption => selectedOption.value !== "*owners")])
                    }
                }
            }

            if (!previouslyAllSelected && actuallyAllSelected) {
                return ([...allSelectedArray])
            } else {
                if (previouslyAllSelected && !actuallyAllSelected) {
                    return ([])
                } else {
                    if (previouslyAllSelected && actuallyAllSelected) {
                        return ([...selectedOption.filter(selectedOption => selectedOption.value !== "*")])
                    } else {
                        return (selectedOption?.length === allSelectedArray?.length - 1 ? [...allSelectedArray] : [...selectedOption])
                    }
                }
            }
        });
    };
    const transfromUser = (user) => {
        return ({ ...user, label: user?.email, value: user?.email })
    }

    const values = useMemo(() => {
        return clientStatus === "succeeded"
            ? [
                { label: "All clients", value: "*" },
                { label: "Owners", value: "*owners" },
                ...fundsWithUsers?.map(
                    fundWithUsers => (
                        {
                            value: fundWithUsers.fundId + "",
                            isFund: true,
                            isDisabled: fundWithUsers?.users?.length === 0,
                            label: `${t(`Users with holdings on "{{fundName}}"`, { fundName: fundWithUsers?.fundName })} (${fundWithUsers?.users?.length} ${t("Users")})`
                        }
                    )
                ),
                ...clients?.map(
                    client => ({
                        label: client.alias,
                        value: client.alias,
                        id: client.id,
                        options: client?.users?.map(userToClient => transfromUser(userToClient?.user))
                    })
                )]
            : []
    }, [clientStatus, clients, fundsWithUsers, t])

    const filterOption = ({ label, value }, string) => {
        // default search
        if (label?.includes(string) || value?.includes(string)) return true;

        // check if a group as the filter string as label
        const groupOptions = values?.filter((group) =>
            group?.label?.toLowerCase()?.includes(string?.toLowerCase())
        );

        if (groupOptions) {
            for (const groupOption of groupOptions) {
                // Check if current option is in group
                const option = groupOption?.options?.find((opt) => opt?.value?.toLowerCase() === value?.toLowerCase());
                if (option) {
                    return true;
                }
            }
        }
        return false;
    };
    const getUsersByFundId = (fundId) => {
        return fundsWithUsers.find(fundWithUsers => (fundWithUsers.fundId + "") === fundId)?.users || []
    }
    const allSelectedFund = (fundId) => {
        const fundUsers = getUsersByFundId(fundId)
        return (fundUsers.length > 0) && (selectedOptions?.filter(option => fundUsers?.find(user => user.email === option.email))?.length === fundUsers?.length)
    }
    const Option = ({ children, ...props }) => {
        const users = props.data.isFund ? getUsersByFundId(props.data.value) : []
        return (
            <components.Option className='ps-4' {...props}>
                <Form.Check className='d-inline-block' readOnly checked={props.data.isFund ? allSelectedFund(props?.data?.value) : props.isSelected} label={t(children)} />
                {
                    users.length > 0 &&
                    <TooltipInfo placement="auto" text={
                        <p className='text-start mb-0'>
                            {

                                users.map((user, index) => <span className='text-start text-nowrap' key={index}>{index !== 0 && <br />}{user.email}</span>)
                            }
                        </p>

                    }
                        tooltipClassName="max-width-unset"
                        trigger={["hover", "focus"]}
                    />

                }
            </components.Option>
        );
    }

    const MultiValue = ({ children, ...props }) => {
        const allSelected = props?.getValue()?.filter(option => option?.value === "*")?.length > 0
        const isSelectAll = props?.data?.value === "*"

        const ownersSelected = props?.getValue()?.filter(option => option?.value === "*owners")?.length > 0
        const isSelectOwners = props?.data?.value === "*owners"
        return (
            ((allSelected && !isSelectAll) || (ownersSelected && !isSelectOwners)) ?
                null
                :
                <components.MultiValue {...props}>
                    {t(children)}
                </components.MultiValue>
        );
    }

    const getClientById = (clientId) => clients?.find(client => client.id === clientId)

    useEffect(() => {

        const objectsEqual = (o1, o2) =>
            typeof o1 === 'object' && Object.keys(o1)?.length > 0
                ? Object.keys(o1)?.length === Object.keys(o2)?.length
                && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
                : o1 === o2;

        const arraysEqual = (a1, a2) =>
            a1?.length === a2?.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

        if (selectedOptions?.length > 0) {
            if (selectedOptions.find(selectedOption => selectedOption.value === "*owners")) {
                if (!arraysEqual(selectedOptions, allOwnersArray)) {
                    setSelectedOptions(prevState => ([...prevState.filter(selectedOption => selectedOption.value !== "*owners")]))
                }
            } else {
                if (arraysEqual(selectedOptions, allOwnersArray.filter(selectedOption => selectedOption.value !== "*owners"))) {
                    setSelectedOptions([...allOwnersArray])
                }
            }

        }
        //eslint-disable-next-line
    }, [selectedOptions])

    // const selectFund = (fundWithUsers) => {
    //     const shortcutOptions = fundWithUsers.users.map(user =>
    //         users.find(userFind => userFind.email === user.email)
    //     )
    //     setSelectedOptions(
    //         prevState => {
    //             const aux = [...shortcutOptions]
    //             return [
    //                 ...[...new Set(aux.map(({ email }) => email))].map(email => {
    //                     const user = aux.find(option => option.email === email)
    //                     return { ...user, label: user?.email, value: user?.email }
    //                 })
    //             ]
    //         }
    //     )
    //     //eslint-disable-next-line
    // }

    useEffect(() => {

        const objectsEqual = (o1, o2) =>
            typeof o1 === 'object' && Object.keys(o1)?.length > 0
                ? Object.keys(o1)?.length === Object.keys(o2)?.length
                && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
                : o1 === o2;

        const arraysEqual = (a1, a2) =>
            a1?.length === a2?.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

        const alphSelectedOptions = selectedOptions.sort((a, b) =>
            a?.email?.localeCompare(b?.email))

        const alphAllArray = allSelectedArray.sort((a, b) =>
            a?.email?.localeCompare(b?.email))

        if (alphSelectedOptions?.length > 0) {
            if (alphSelectedOptions.filter(selectedOption => selectedOption.value === "*")?.length === 1) {
                if (!arraysEqual(alphSelectedOptions, alphAllArray)) {
                    setSelectedOptions(prevState => ([...prevState.filter(selectedOption => selectedOption.value !== "*")]))
                }
            } else {
                if (alphSelectedOptions?.length === alphAllArray.filter(selectedOption => selectedOption.value !== "*")?.length) {
                    setSelectedOptions([...alphAllArray])
                }
            }

        }
        //eslint-disable-next-line
    }, [selectedOptions])

    useEffect(() => {
        const uniqueValues = [...new Set(values.flatMap(option => (option.options || []).map(option => option.value)))]
        const sortedSelectedOptions = selectedOptions.sort((a, b) => uniqueValues.indexOf(a.value) - uniqueValues.indexOf(b.value)).filter(selectedOption => uniqueValues?.includes(selectedOption.value));
        // const sortedOptions = selectedOptions.
        if (sortedSelectedOptions?.length > maxClients) {
            setSelectedOptions(sortedSelectedOptions.slice(0, maxClients))
            maximumReached()
        }
    }, [maximumReached, selectedOptions, values])

    const selectUsersByClientId = (clientId) => {
        setSelectedOptions(prevState => {
            let aux = [...prevState]
            let client = getClientById(clientId)
            let appendToArray =
                (client?.users || [])?.map(
                    userToClient => ({ value: userToClient?.user?.email, label: userToClient?.user?.email, email: userToClient?.user?.email })
                ).filter(
                    //eslint-disable-next-line 
                    selectedOption => aux.filter(selectedOptionFilter => selectedOptionFilter.value === selectedOption.value)?.length === 0
                )
            return [...aux, ...appendToArray]
        })
    }

    const deSelectUsersByClientId = (clientId) => {
        setSelectedOptions(prevState => {
            let aux = [...prevState]
            let client = getClientById(clientId)
            aux = [...aux.filter(
                selectedOption => {
                    return client.users?.filter(clientUser => selectedOption.value === clientUser.user.email)?.length === 0
                }
            )]
            return [...aux]
        })
    }

    console.log(clients)
    const GroupHeading = ({ children, ...props }) => {

        const clientUsers = getClientById(props?.data?.id)?.users || []
        const isAllFundsShortcut = props?.data?.value === "*funds"
        const allUsersFromClientSelected = !isAllFundsShortcut && selectedOptions?.filter(option => clientUsers.filter(clientUser => clientUser.user.email === option.email)?.length > 0)?.length === clientUsers?.length;

        return (
            <components.GroupHeading {...props} className={`${props?.className ? props?.className : ""} ${allUsersFromClientSelected ? "selected" : ""}`}
                onClick={() => (!isAllFundsShortcut) && allUsersFromClientSelected ? deSelectUsersByClientId(props?.data?.id) : selectUsersByClientId(props?.data?.id)}>
                <Form.Check checked={allUsersFromClientSelected} readOnly label={t("Client {{clientName}}", { clientName: children })} />
            </components.GroupHeading>
        );
    }

    const [show, setShow] = useState(false)

    return (
        <Container className="h-100 broadcast">
            <Row className="h-100 d-flex justify-content-center">
                <Col className="growOpacity section">
                    <div className="header">
                        <h1 className="title fw-normal">{t("Broadcast to users")}</h1>
                    </div>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                {t("Recipients")}
                                {/* <div className='tiptap-wrapper d-inline-block'>
                                    <select
                                        className='ms-2'
                                        style={{ width: "12ch" }}
                                        value=""
                                        onChange={e => selectFund(fundsWithUsers.find(fund => fund.fundId + "" === e.target.value))}>
                                        <option value="" disabled>
                                            {t("Holdings")}
                                        </option>
                                        {
                                            fundsWithUsers?.map(
                                                fundWithUsers => (
                                                    <option value={fundWithUsers.fundId} key={fundWithUsers.fundId}>
                                                        {`${t(`Users with holdings on "{{fundName}}"`, { fundName: fundWithUsers?.fundName })} (${fundWithUsers?.users?.length} ${t("Users")})`}
                                                    </option>
                                                )
                                            )
                                        }
                                    </select>
                                </div> */}
                            </Form.Label>
                            <div>
                                <Select
                                    value={selectedOptions} onChange={handleChangeMultiSelect}
                                    isMulti isClearable isLoading={clientStatus !== "succeeded"}
                                    closeMenuOnSelect={false} hideSelectedOptions={false}
                                    noOptionsMessage={() => t("No options")} placeholder={t("Select recipients")} loadingMessage={() => t("Loading")}
                                    filterOption={filterOption} options={values} components={{ Option, MultiValue, GroupHeading }}
                                    className="w-100"
                                    classNames={{
                                        container: () => (selectedOptions?.length > 0 ? "has-value" : ""),
                                        groupHeading: () => ("groupHeading"),
                                        multiValue: () => ("multiValue"),
                                        multiValueLabel: () => ("multiValueLabel"),
                                        multiValueRemove: () => ("multiValueRemove"),
                                    }}
                                />
                            </div>
                            {
                                selectedOptions?.length === 0 &&
                                <Form.Text className='text-red validation-text'>
                                    {t("Select at least one recipient")}
                                </Form.Text>
                            }
                        </Form.Group>

                        <Form.Group className="mb-3" controlId='title'>
                            <Form.Label>{t("Email title")}</Form.Label>
                            <Form.Control
                                onChange={handleChange} value={formData.title} className="mb-1" required maxLength="250"
                            />
                        </Form.Group>

                        <Form.Label>{t("Email body")}</Form.Label>
                        {/* <ReactQuill
                            required
                            className={`mb-3 ${formData.emailBody !== emailBodyDefaultState ? "" : "invalid"}`}
                            theme="snow"
                            value={formData.emailBody} onChange={value => handleChange({ target: { id: "emailBody", value } })}
                        /> */}

                        <div className="tiptap-wrapper">
                            <EditorTipTap content={formData.emailBody} setContent={value => handleChange({ target: { id: "emailBody", value } })} />
                        </div>

                        <Form.Group controlId="formFileMultiple" className="mb-3">
                            <Form.Label>{t("Attached files")}</Form.Label>
                            <Form.Control ref={filesInput} type="file" multiple />
                        </Form.Group>

                        <p>{t(message)}</p>
                        <ModalPreview show={show} setShow={setShow} formData={formData} emailBodyWihtImagesStyles={emailBodyWihtImagesStyles} />
                        <div className='d-flex justify-content-end'>
                            <Button className="mb-3 me-2" disabled={buttonDisabled || selectedOptions?.length === 0} variant="danger" type="button" onClick={() => setShow(true)}>
                                {t("Preview")}
                            </Button>
                            <Button className="mb-3" disabled={buttonDisabled || selectedOptions?.length === 0} variant="danger" type="submit" >
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ display: buttonDisabled ? "inline-block" : "none" }}
                                />{' '}
                                {t("Submit")}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container >
    )
}
export default Broadcast
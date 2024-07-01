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
import Editor from './quill';
import { ModalPreview } from './ModalPreview';
import { useDispatch, useSelector } from 'react-redux';
import { fetchusers, selectAllusers } from 'Slices/DashboardUtilities/usersSlice';

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
    const usersStatus = useSelector(state => state.users.status)
    const users = useSelector(selectAllusers)
    const dispatch = useDispatch()
    useEffect(() => {
        if (usersStatus === 'idle') {
            dispatch(fetchusers({ all: true }))
        }
    }, [dispatch, usersStatus])

    const [Clients, setClients] = useState({ fetching: true, fetched: false, valid: false, content: [] })
    const getUserById = useCallback((id) => users.find(user => user.id === id), [users],
    )

    const clients = useMemo(() => ({ ...Clients, content: Clients.content.map(client => ({ ...client, users: client.users.filter(userToClient => getUserById(userToClient?.userId)?.enabled) })) }), [Clients, getUserById])

    const [validated, setValidated] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const handleChange = (event) => {
        setFormData(prevState => ({ ...prevState, [event?.target?.id]: event?.target?.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() && formData.emailBody !== emailBodyDefaultState) {
            broadcast()
        }
        setValidated(true);
    }
    const emailBodyWihtImagesStyles = useCallback(
        () => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(formData.emailBody, "text/html");
            let images = doc.querySelectorAll('img');
            images.forEach(img => {
                img.style.width = '100%';
                img.style.display = 'block';
            });
            return new XMLSerializer().serializeToString(doc)
        }, [formData.emailBody])

    const broadcast = async () => {

        setButtonDisabled(true)
        const formDataSubmit = new FormData()

        const files = filesInput.current.files

        for (var i = 0; i < files.length; i++) {
            formDataSubmit.append("files", files[i])
        }

        let receivers = selectedOptions.map(receiver => receiver.email)
        for (var j = 0; j < receivers.length; j++) {
            formDataSubmit.append("receivers", receivers[j])
        }

        formDataSubmit.append("title", formData.title)

        formDataSubmit.append("emailBody", emailBodyWihtImagesStyles())
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


    const getClients = useCallback((signal) => {
        setClients((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/clients`, {
            params: { all: true, showUsers: true },
            signal: signal,
        }).then(function (response) {
            setClients((prevState) => (
                {
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true,
                    content: response.data,
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setClients((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
        //eslint-disable-next-line
    }, [setClients]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getClients(signal)

        return () => {
            controller.abort();
        };
    }, [getClients])

    const filesInput = useRef(null)

    var allSelectedArray = [{ label: "All clients", value: "*" }]

    for (let client of clients.content) {
        let appendToArray = []
        appendToArray = client.users.map(
            userToClient => ({ value: userToClient?.user?.email, label: userToClient?.user?.email, email: userToClient?.user?.email })
        ).filter(
            //eslint-disable-next-line 
            selectedOption => allSelectedArray.filter(
                selectedOptionFilter => selectedOptionFilter.value === selectedOption.value
            ).length === 0)
        allSelectedArray = [...allSelectedArray, ...appendToArray]
    }

    var allOwnersArray = [{ label: "Owners", value: "*owners" }]
    for (let client of clients.content) {
        let appendToArray = []
        appendToArray = client.users.filter(user => user?.isOwner).map(
            userToClient => ({ value: userToClient?.user?.email, label: userToClient?.user?.email, email: userToClient?.user?.email })
        ).filter(
            //eslint-disable-next-line 
            selectedOption => allOwnersArray.filter(
                selectedOptionFilter => selectedOptionFilter.value === selectedOption.value
            ).length === 0)
        allOwnersArray = [...allOwnersArray, ...appendToArray]
    }

    const handleChangeMultiSelect = (selectedOption) => {
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

    const values = useMemo(() => {
        return clients?.fetched
            ? [
                { label: "All clients", value: "*" },
                { label: "Owners", value: "*owners" },
                ...clients?.content?.map(
                    client => ({
                        label: client.alias,
                        value: client.alias,
                        id: client.id,
                        options: client.users.map(
                            userToClient => ({ ...userToClient?.user, label: userToClient?.user?.email, value: userToClient?.user?.email })
                        )
                    })
                )]
            : []
    }, [clients?.content, clients?.fetched])

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

    const Option = ({ children, ...props }) => {
        return (
            <components.Option className='ps-4' {...props}>
                <Form.Check readOnly checked={props.isSelected} label={t(children)} />
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

    const getClientById = (clientId) => clients?.content?.find(client => client.id === clientId)

    useEffect(() => {

        const objectsEqual = (o1, o2) =>
            typeof o1 === 'object' && Object.keys(o1).length > 0
                ? Object.keys(o1).length === Object.keys(o2).length
                && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
                : o1 === o2;

        const arraysEqual = (a1, a2) =>
            a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

        if (selectedOptions.length > 0) {
            if (selectedOptions.filter(selectedOption => selectedOption.value === "*owners").length === 1) {
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


    useEffect(() => {

        const objectsEqual = (o1, o2) =>
            typeof o1 === 'object' && Object.keys(o1).length > 0
                ? Object.keys(o1).length === Object.keys(o2).length
                && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
                : o1 === o2;

        const arraysEqual = (a1, a2) =>
            a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

        const alphSelectedOptions = selectedOptions.sort((a, b) =>
            a?.email?.localeCompare(b?.email))

        const alphAllArray = allSelectedArray.sort((a, b) =>
            a?.email?.localeCompare(b?.email))

        if (alphSelectedOptions.length > 0) {
            if (alphSelectedOptions.filter(selectedOption => selectedOption.value === "*").length === 1) {
                if (!arraysEqual(alphSelectedOptions, alphAllArray)) {
                    setSelectedOptions(prevState => ([...prevState.filter(selectedOption => selectedOption.value !== "*")]))
                }
            } else {
                if (alphSelectedOptions.length === alphAllArray.filter(selectedOption => selectedOption.value !== "*").length) {
                    setSelectedOptions([...alphAllArray])
                }
            }

        }
        //eslint-disable-next-line
    }, [selectedOptions])

    useEffect(() => {
        const uniqueValues = [...new Set(values.flatMap(option => (option.options || []).map(option => option.value)))]
        const sortedSelectedOptions = selectedOptions.sort((a, b) => uniqueValues.indexOf(a.value) - uniqueValues.indexOf(b.value)).filter(selectedOption => uniqueValues.includes(selectedOption.value));
        // const sortedOptions = selectedOptions.
        if (sortedSelectedOptions.length > maxClients) {
            setSelectedOptions(sortedSelectedOptions.slice(0, maxClients))
            maximumReached()
        }
    }, [maximumReached, selectedOptions, values])

    const selectUsersByClientId = (clientId) => {
        setSelectedOptions(prevState => {
            let aux = [...prevState]
            let client = getClientById(clientId)
            let appendToArray =
                client?.users?.map(
                    userToClient => ({ value: userToClient?.user?.email, label: userToClient?.user?.email, email: userToClient?.user?.email })
                ).filter(
                    //eslint-disable-next-line 
                    selectedOption => aux.filter(selectedOptionFilter => selectedOptionFilter.value === selectedOption.value).length === 0
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
                    return client.users.filter(clientUser => selectedOption.value === clientUser.user.email).length === 0
                }
            )]
            return [...aux]
        })
    }


    const GroupHeading = ({ children, ...props }) => {

        const clientUsers = getClientById(props?.data?.id)?.users
        const allUsersFromClientSelected = selectedOptions.filter(option => clientUsers.filter(clientUser => clientUser.user.email === option.email).length > 0).length === clientUsers.length;

        return (
            <components.GroupHeading {...props} className={`${props?.className ? props?.className : ""} ${allUsersFromClientSelected ? "selected" : ""}`}
                onClick={() => allUsersFromClientSelected ? deSelectUsersByClientId(props?.data?.id) : selectUsersByClientId(props?.data?.id)}>
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
                        <h1 className="title">{t("Broadcast to users")}</h1>
                    </div>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Recipients")}</Form.Label>
                            <div>
                                <Select

                                    value={selectedOptions} onChange={handleChangeMultiSelect}
                                    isMulti isClearable isLoading={clients.fetching}
                                    closeMenuOnSelect={false} hideSelectedOptions={false}
                                    noOptionsMessage={() => t("No options")} placeholder={t("Select recipients")}
                                    filterOption={filterOption} options={values} components={{ Option, MultiValue, GroupHeading }}
                                    className="w-100 mb-2"
                                    classNames={{
                                        groupHeading: () => ("groupHeading"),
                                        multiValue: () => ("multiValue"),
                                        multiValueLabel: () => ("multiValueLabel"),
                                        multiValueRemove: () => ("multiValueRemove"),
                                    }}
                                />
                            </div>

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
                        <Editor value={formData.emailBody} handleChange={value => {
                            handleChange({ target: { id: "emailBody", value } })
                        }} />

                        <Form.Group controlId="formFileMultiple" className="mb-3">
                            <Form.Label>{t("Attached files")}</Form.Label>
                            <Form.Control ref={filesInput} type="file" multiple />
                        </Form.Group>

                        <p>{t(message)}</p>
                        <ModalPreview show={show} setShow={setShow} formData={formData} emailBodyWihtImagesStyles={emailBodyWihtImagesStyles} />
                        <div className='d-flex justify-content-end'>
                            <Button className="mb-3 me-2" disabled={buttonDisabled || selectedOptions.length === 0} variant="danger" type="button" onClick={() => setShow(true)}>
                                {t("Preview")}
                            </Button>
                            <Button className="mb-3" disabled={buttonDisabled || selectedOptions.length === 0} variant="danger" type="submit" >
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
        </Container>
    )
}
export default Broadcast
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Button, Popover, OverlayTrigger, Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const OverdraftPopover = ({ children, handleSubmit, setOverdraft, overdraft }) => {
    const { t } = useTranslation()

    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom"
            rootClose
            overlay={
                <Popover id={`popover-positioned-overdraft`}>
                    <Popover.Body>
                        <Form noValidate onSubmit={handleSubmit}>
                            <InputGroup size='sm' >
                                <Form.Control
                                    size='sm'
                                    onChange={e => setOverdraft(prevState => ({ ...prevState, amount: e.target.value }))}
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder={t("Overdraft amount")}
                                    required
                                    value={overdraft.amount}
                                />
                                <Button size='sm' type="submit" disabled={overdraft.amount===""}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </Button>
                            </InputGroup>
                        </Form>
                    </Popover.Body>
                </Popover>
            }
        >
            {children}
        </OverlayTrigger>
    )
}

export default OverdraftPopover
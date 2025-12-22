const { Modal } = require("react-bootstrap")
const { useTranslation } = require("react-i18next")

export const ModalPreview = ({ show, setShow, formData, emailBodyWihtImagesStyles }) => {
    const { t } = useTranslation()
    return (<Modal
        size="lg"
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
    >
        <Modal.Header closeButton style={{ background: "white" }}>
            <Modal.Title id="example-modal-sizes-title-lg">
                {t("Broadcast preview")}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "white", display: "flex", justifyContent: "center", borderBottomLeftRadius: "var(--bs-modal-inner-border-radius)", borderBottomRightRadius: "var(--bs-modal-inner-border-radius)" }} >
            <div dangerouslySetInnerHTML={{
                __html: `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border:0;border-collapse:collapse;max-width:600px!important">
                        <tbody><tr>
                            <td valign="top" id="m_7429531011328420166templateHeader" style="border-bottom:0;border-top:0">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;min-width:100%">
                                    <tbody>
                                        <tr>
                                            <td valign="top">
                                                
                                                <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;min-width:100%">
                                                    <tbody>
                                                        <tr>
                                                            <td style="padding-bottom:9px;padding-left:18px;padding-right:18px;padding-top:9px">
                                                                <table border="0" cellspacing="0" width="100%" style="background-color:#082044;border-collapse:collapse;min-width:100%!important">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td valign="top" style="color:#f2f2f2;font-family:Helvetica;font-size:14px;font-weight:normal;line-height:150%;padding:18px;text-align:center;word-break:break-word">
                                                                                <div style="text-align:left"><strong><span style="font-size:1.25rem">GWMG</span></strong><br>
                                                                                    <span style="font-size:19px">Global Wealth Management</span></div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                
                                                
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;min-width:100%">
                                    <tbody>
                                        <tr>
                                            <td valign="top" style="padding-top:9px">
                                                
                                                
                                                <table align="left" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:100%;min-width:100%" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td valign="top" style="color:#202020;font-family:Helvetica;font-size:1rem;line-height:150%;padding-bottom:9px;padding-left:18px;padding-right:18px;padding-top:0;text-align:left;word-break:break-word">
                                                                <strong>${formData.title}</strong>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                
                                                
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td valign="top" id="m_7429531011328420166templateBody" style="border-bottom:0;border-top:0">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;min-width:100%">
    <tbody>
        <tr>
            <td valign="top" style="padding-top:9px">
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:100%;min-width:100%" width="100%">
                    <tbody>
                        <tr>
                        <td valign="top" style="color:#202020;font-family:Helvetica;font-size:1rem;line-height:150%;padding-bottom:9px;padding-left:18px;padding-right:18px;padding-top:0;text-align:left;word-break:break-word">
                        <p style="color:#202020;font-family:Helvetica;font-size:1rem;line-height:150%;margin:10px 0">
                        <div style="background-color:#ffffff;background-image:none;background-position:center;background-repeat:no-repeat;background-size:cover;height:100%;margin:0;padding:0;width:100%">
                        <p style="color:#202020;font-family:Helvetica;font-size:1rem;line-height:150%;margin:10px 0;padding:0;text-align:left">
                        ${emailBodyWihtImagesStyles()}
                        </p>
                        </div>
                        </p>
                    </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                            </td>
                        </tr>
                        <tr>
                            <td valign="top" id="m_7429531011328420166templateFooter" style="border-bottom:0;border-top:0">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;min-width:100%">
                                    <tbody>
                                        <tr>
                                            <td valign="top" style="padding-top:9px">
                                                
                                                
                                                <table align="left" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:100%;min-width:100%" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td valign="top" style="color:#202020;font-family:Helvetica;font-size:12px;line-height:150%;padding-bottom:9px;padding-left:18px;padding-right:18px;padding-top:0;text-align:left;word-break:break-word">
                                                                <div style="text-align:justify">
                                                                    <span style="font-size:13px">
                                                                        <em>
                                                                            Este e-mail es automático. Por favor no respondas a esta casilla de correo. Ante cualquier consulta adicional ingresá a la plataforma online o contáctate a la dirección de correo <a href="mailto:info@gwmstudio.com" target="_blank">info@gwmstudio.com</a>
                                                                        </em>
                                                                    </span>
                                                                </div><br>
                                                                Gracias,<br>
                                                                Equipo GWMG Studio.
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                
                                                
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;min-width:100%">
                                    <tbody>
                                        <tr>
                                            <td valign="top" style="padding-top:9px">
                                                
                                                
                                                <table align="left" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:100%;min-width:100%" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td valign="top" style="color:#202020;font-family:Helvetica;font-size:12px;line-height:150%;padding-bottom:9px;padding-left:18px;padding-right:18px;padding-top:0;text-align:left;word-break:break-word">
                                                                <em>Copyright © 2022 GWMG Studio, All rights reserved.</em><br>
                                                                <a href="https://gwmstudio.com" style="color:#202020;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://gwmstudio.com&amp;source=gmail&amp;ust=1714844637636000&amp;usg=AOvVaw1qDYZVZp-0CcMEAhXzNCTW">www.gwmstudio.com</a><br> &nbsp;
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                
                                                
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody></table>` }}></div>
        </Modal.Body>
    </Modal>)
}
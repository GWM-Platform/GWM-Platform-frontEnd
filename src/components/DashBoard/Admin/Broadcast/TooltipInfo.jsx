import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const TooltipInfo = ({ icon, children, fontSize = "11px", text = "Información adicional", trigger = ["click", "focus"], link = false, tooltipClassName = "", btnClassName = "btn no-style alt-focus mx-1 d-inline-block", placement = "bottom", buttonStyle = {}, buttonProps = {} }) => {

    const LinkToSection = () => (
        link !== false &&
        <>&nbsp;<Link to={link.to}>{link.text}</Link></>
    )

    return (
        <OverlayTrigger
            placement={placement}
            trigger={trigger}
            delay={{ show: 250, hide: 400 }}
            popperConfig={{
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 0],
                        },
                    },
                ],
            }}
            overlay={
                <Tooltip className={tooltipClassName} id="category-info-tooltip">
                    {text} <LinkToSection />
                </Tooltip>
            }
        >
            <button type="button" className={`${btnClassName}`} style={{
                color: "grey",
                verticalAlign: "middle",
                lineHeight: "1em",
                marginBottom: "2px",
                fontSize, ...buttonStyle
            }} {...buttonProps} >
                {
                    children ?
                        children
                        :
                        <FontAwesomeIcon icon={icon || faInfoCircle} />
                }
            </button>
        </OverlayTrigger >
    );
}

export default TooltipInfo
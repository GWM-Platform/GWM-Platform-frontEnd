import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

//TODO: añadir only-excel para el dato que solo se muestra en excel
const MultipleItemsCell = ({ className = "emphasis text-center mb-0", array, transformer = (item) => item, fallback = "", showTypology = true, trigger = ['focus', 'click'], mainValue = false, showInfoIcon = false, list = true, buttonClassName="more",buttonStyle }) => {

  if (!array?.[0]) {
    return fallback;
  }

  const renderText = (item, key) => (
    list ?
      <li key={`item-${key}`}>
        <span>{transformer(item, true, showTypology)}</span>
        <br />
      </li>
      :
      <span key={`item-${key}`}>
        <span>{transformer(item, true, showTypology)}</span>
      </span>
  );

  return (
    <span className="d-inline-flex align-items-center justify-content-center">
      {array.length > 1 ? (
        <>
          <span className={className}>{mainValue ? mainValue(array) : transformer(array[0], false, showTypology)}</span>&nbsp;
          <OverlayTrigger
            trigger={trigger}
            placement="auto"
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
              <Tooltip className="moreTooltip" id="more-units-tooltip">
                <div className="text-start">
                  {list ?
                    <ul>
                      {array.map((item, key) => renderText(item, key))}
                    </ul>
                    :
                    <div className="d-flex flex-wrap" style={{ gap: "10px" }}>
                      {array.map((item, key) => renderText(item, key))}
                    </div>
                  }
                </div>
              </Tooltip>
            }
          >
            <button type="button" className={buttonClassName} style={buttonStyle}>{showInfoIcon ? <FontAwesomeIcon icon={faCircleInfo} /> : `+${array.length - 1}`}</button>
          </OverlayTrigger>
        </>
      ) : (
        <span className={className}>{transformer(array[0], false, showTypology)}</span>
      )}
    </span>
  );
};

export default MultipleItemsCell;
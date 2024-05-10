import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from 'react'
import "./index.scss"
export const ToggleReveal = ({ children }) => {
    const [reveal, setReveal] = useState(false);
    const toggleReveal = () => setReveal(prevState => !prevState);

    return (
        <div className="password-reveal-wrapper">
            {React.Children.map(children, child => {
                return React.cloneElement(child, { type: reveal ? "text" : "password" });
            })}
            <button className='noStyle reveal-button' onClick={toggleReveal} type='button'>
                <span className='p-relative'>
                    <FontAwesomeIcon className="icon-placeholder" icon={faEyeSlash} />
                    <FontAwesomeIcon className={`icon-indicator ${reveal ? "hidden" : ""}`} icon={faEye} />
                    <FontAwesomeIcon className={`icon-indicator ${reveal ? "" : "hidden"}`} icon={faEyeSlash} />
                </span>
            </button>
        </div>
    )
}
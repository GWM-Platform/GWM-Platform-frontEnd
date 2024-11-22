import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./usePrint.scss";
import { resetHtmlPrint, setPrintActive } from 'Slices/DashboardUtilities/PrintHtmlSlice';
import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
// import { useTranslation } from "react-i18next";

export const usePrintDefaults = ({ documentTitle = "", title = "", bodyClass = "", aditionalStyles = "" }) => {
  const componentRef = useRef(null)
  let styleElement = useRef(null); // Guarda una referencia al elemento de estilo
  const dispatch = useDispatch();

  const beforeGetContent = async () => {
    dispatch(setPrintActive());
    await new Promise((resolve) => setTimeout(resolve, 300));
  };

  const handlePrintHook = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      // Elimina el elemento de estilo después de imprimir
      if (styleElement.current) {
        document.head.removeChild(styleElement.current);
        styleElement = { current: null };
      }
      dispatch(resetHtmlPrint());
    },
    copyStyles: true,
    documentTitle: documentTitle || title,
    bodyClass: bodyClass,
    onBeforeGetContent: beforeGetContent,
  });
  const handlePrint = () => {
    styleElement.current = document.createElement('style');
    styleElement.current.type = 'text/css';
    styleElement.current.innerHTML = `
            @media print{
                @page { size: landscape }
            }
            `;
    document.head.appendChild(styleElement.current);
    handlePrintHook()
  }

  const getPageMargins = () => {
    return `@page { 
        margin: 40px !important;
     }`;
  };


  return { handlePrint, getPageMargins, componentRef, title, aditionalStyles };
}


export const PrintButton = ({ handlePrint, disabled = false, variant = "secondary", size = null, className = "", children }) => {
  return (
    <Button className={`${className} print-button no-style`} variant={variant} size={size} onClick={handlePrint} disabled={disabled}>
      {children ? children : <FontAwesomeIcon icon={faPrint} />}
    </Button>
  )
}

export const PrintDefaultWrapper = React.forwardRef(({ children, getPageMargins, title, aditionalStyles = "", className = "", dateFormat = 'LL', positionWrapperClass = 'p-relative' }, ref) => {
  // const { t } = useTranslation()
  return (
    <div className={`flex-grow-1 overflow-auto printContainer d-flex ${positionWrapperClass} flex-column ${className}`} ref={ref} >
      <style>{getPageMargins()}</style>
      {/* Define horizontal or vertical print */}
      {/* Horizontal styles */}
      <style type="text/css">
        {`
                    table { page-break-inside:avoid; page-break-after:auto }
                    .print-title {
                        color: white;
                        font-size: 1.25rem;
                        text-align: start;
                    }
                    .print-date {
                        color: black;
                        font-size: 1rem;
                        text-align: end;
                    }
                    .logo{
                        width: 80px;
                        display: block;
                        background: black;
                    }
                    .print-date,.print-title{
                        page-break-after: avoid;
                        page-break-before: avoid;
                    }
                    @media screen {
                        .print-date, .print-title, .title-wrapper, .only-print, .print-background, .print-header {
                            display: none;
                        }
                    }
                    @media print{    
                        ${aditionalStyles}
                        .toggle-pin-button{ display: none }
                        td[data-column-name="select"],
                        th[data-column-name="select"] {
                            display: none;
                        }
                        .only-screen{
                            display: none;
                        }
                        tr{
                            background-color: unset!important
                        }
                        .rsdt-sortable{
                            display:none
                        }
                        span,.text-danger{
                            color: black !important
                        }
                        body{
                            background-image: url("${process.env.PUBLIC_URL}/images/backGround/background.jpg");
                            background-repeat: no-repeat;
                            background-size: cover;
                            background-color: red;
                        }
                        .print-button{
                            display: none;
                        }
                        .print-background{
                            position: fixed; left: -40px; right: 40px; width: 100%;display: block; z-index: 0
                        }
                        * {
                          z-index: 1;
                        }
                    }
                `}
      </style>
      {/* <img src={`${process.env.PUBLIC_URL}/images/PDF/background.jpg`} className="print-background" alt="" /> */}
      {/* <div className="print-header">
        <img src={`${process.env.PUBLIC_URL}/images/PDF/logo.png`} alt="logo" className="print-header-logo" />
        <div className="print-header-text-container" >
          <h1 className="print-header-text">{t(title)}</h1>
        </div>
      </div> */}
      {children}
    </div>
  )
})


export const usePrintTitle = (FilterOptions, separator = false) => {

  let items = [];

  if (FilterOptions.division) {
    items.push(` División ${FilterOptions.division}`);
  }
  if (FilterOptions.fromDate !== null || FilterOptions.toDate !== null) {

    items.push(PeriodFiltered(FilterOptions));
  }

  return (
    ((items.length > 0 && separator !== false) ? `${separator}` : "") +
    items.reduce((prev, curr, i) => {
      return [...prev, ...(i > 0 ? [", "] : []), curr]
    }, []).join('')
  )
}

const PeriodFiltered = (FilterOptions) => {
  return (
    ` Desde ${FilterOptions.fromDate !== null ? FilterOptions.fromDate?.format("L") : "Inicio"
    } Hasta ${FilterOptions.toDate !== null ? FilterOptions.toDate?.format("L") : "Fin"
    }`
  );
}

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
//import detector from "i18next-browser-languagedetector";
//import backend from "i18next-http-backend";

const getLanguage = () => {
  if (localStorage.getItem("language") !== undefined) {
    localStorage.setItem("language", "es")
    return "es"
  } else {
    localStorage.setItem("language", "gb")
    return "es"
  }
}

i18n
  //.use(detector) //Detects the browser language
  //.use(backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: getLanguage(), // use en if detected lng is not available
    saveMissing: true, // send not translated keys to endpoint

    // the translations
    // (TODO: move them in a JSON file and import them)
    resources: {
      gb: {
        translation: {
          //Translations in English
          //Translations for login 
          "Welcome to React": "Welcome to react",
          "Username": "Username",
          "Password": "Password",
          "Forgot Password?": "Forgot Password?",
          "Login": "Login",
          //Translations for changePassword
          "Password Reset": "Password Reset",
          "Enter your user account's verified email address and we will send you a password reset link.":
            "Enter your user account's verified email address and we will send you a password reset link.",
          "Send password reset email": "Send password reset email"
          //Translation for Currencyes ABM
        }
      },
      es: {
        translation: {
          //Translations in Spanish
          //Translations for login
          "Welcome to React": "Bienvenido a react",
          "Username or Email": "Nombre de usuario o email",
          "Password": "Contraseña",
          "Forgot Password?": "¿Olvidaste tu contraseña?",
          "Login": "Iniciar Sesión",
          "Keep me logged in": "Mantener la sesión iniciada",
          "Sorry, the login failed! Please Try again": "Lo sentimos, el inicio de sesión falló. Inténtalo de nuevo",
          //Translations for changePassword
          "Password Reset": "Restablecimiento de contraseña",
          "Enter your user account's verified email address. We will send you a password reset link.":
            "Ingrese la dirección de correo electrónico verificada de su cuenta. Le enviaremos un enlace de restablecimiento de contraseña.",
          "Send password reset email": "Enviar Email de restablecimiento de contraseña",
          "Sorry, the request failed! Please Try again": "Lo sentimos, la solicitud falló. Inténtalo de nuevo",
          //Translation for Currencies ABM
          "Currencies": "Monedas",
          "Add New": "Agregar una nueva",
          "Currency Code": "Codigo de la Moneda",
          "Currency Name": "Nombre de la Moneda",
          "Currency Symbol": "Simbolo de la Moneda",
          "No search results found": "No se encontraron resultados para su busqueda",
          "Return": "Volver",
          "Submit": "Enviar",
          //Translation for changePassword
          "username":"Nombre de Usuario",
          "Change password": "Reestablecer contraseña",
          "Change password for": "Reestablecer la contraseña para",
          "Confirm password": "Confirmar contraseña",
          "8 characters lenght": "8 caracteres.",
          "a number": "un número",
          "a lowercase letter": "una letra minúscula",
          "a capital letter": "una letra mayúscula",
          "a symbol": "un símbolo",
          "The fields \"password\" and \"confirm password\" don't match": "Los campos \"contraseña\" y \"confirmar contraseña\" no coinciden",
          //Translation for dashboard
          "Loading Content": "Cargando Contenido",
          "Your user don't have any account": "Su usuario no dispone de ninguna cuenta",
          "Account": "Usuario",
          "LogOut": "Cerrar Sesión",
          "Home": "Inicio",
          "Credit": "Credito",
          "Debit": "Debito",
          "Product Line": "Linea de producto",
          "Account last movements": "Ultimos movimientos de la cuenta",
          "Description": "Descripción",
          "Date": "Fecha",
          "Amount": "Monto",
          "Check account": "Cuenta de cheques",
          "Savings account": "Cuenta de ahorros",
          "Make sure at least the new password have": "Asegurese de que contenga al menos",
          "English": "Inglés",
          "Spanish": "Español",
          "There is no record of any movement in this account": "No hay registro de ningún movimiento en esta cuenta",
          //Translation for transfer request
          "Account menu": "Menú de la cuenta",
          "Account Number": "Número de cuenta",
          "Transaction Request": "Solicitud de transferencia",
          "Source Account ID": "ID de cuenta de origen",
          "Transaction Destination": "Destino de la transferencia",
          "Internal transaction": "Transferencia interna",
          "Wadiah customer": "Cliente de Wadiah",
          "US transaction": "Transferencia a EE. UU.",
          "International transaction": "Transferencia internacional",
          "Internal Transactions": "Transferencias internas",
          "Bank Address": "Dirección del banco",
          "Please, select a source account for the transaction": "Por favor, seleccione una cuenta de origen para la transacción",
          "Please, enter a short description about the transaction": "Por favor, ingrese una corta descripcion sobre la transferencia",
          "Please, enter the movement amount": "Por favor, ingrese la cantidad que desea transferir",
          "Please, select the source account to autocomplete this field": "Por favor, seleccione la cuenta de origen para que este campo sea autocompletado"
          , "Currency": "Moneda"
          , "Movement Amount": "Cantidad a transferir"
          , "Please, enter at least 3 characters to search and select the country of origin of the bank to which the target account belongs":
            "Por Favor, ingrese por lo menos 3 caracteres para buscar y seleccionar el pais de origen del banco al que pertenece la cuenta destino",
          "Country": "Pais",
          "City": "Ciudad",
          "Address": "Direccion",
          "State": "Estado"
          , "Please, enter at least 3 characters to search and select the state of origin of the bank to which the target account belongs":
            "Por favor, ingrese por lo menos 3 caracteres para buscar y seleccionar el estado de origen del banco al que pertenece la cuenta destino"
          , "Please, enter at least 3 characters to search and select the city of origin of the bank to which the target account belongs":
            "Por favor, ingrese por lo menos 3 caracteres para buscar y seleccionar la ciudad de origen del banco al que pertenece la cuenta destino"
          , "Please, enter the address from the bank to which the target account belongs": "Por favor, ingrese la direccion del banco al que pertenece la cuenta destino"
          , "Save target account details to use for future transactions": "Guardar los detalles de la cuenta destino para transferencia futuras"
          , "Target Beneficiary": "Beneficiario destino",
          "Please, enter the name of the owner of source account": "Por favor, ingrese el nombre de la persona a la que pertenece la cuenta destino",
          "Target Bank Name": "Nombre del Banco destino",
          "Please, enter the name from the  bank which the target account belongs": "Por favor, ingrese el nombre del banco al que pertenece la cuenta destino"
          , "Target Routing Number": "Numero de Ruta Bancaria destino",
          "Please, enter the routing number from the bank which the target account belongs": "Por favor, ingrese el numero de ruta bancaria del banco al que pertenece la cuenta destino",
          "Target Account ID": "ID de la cuenta destino",
          "Target Account": "Cuenta destino",
          "Please, enter the id from the target account": "Por favor, ingrese la ID de la cuenta destino",
          "Please, select the target account": "Por favor, seleccione la cuenta destino",
          "-- select an option --": "-- Seleccione una opcion --",
          "Client of Another Bank": "Cliente de otro banco",
          "The external number doesn't match with any Wadiah's account": "El numero de cuenta ingresado no corresponde con ninguna cuenta perteneciente a Wadiah",
          "The external number entered belongs to an account with a currency different from the source account":
            "El numero de cuenta ingresado corresponde a una cuenta con una moneda diferente a la de la cuenta de origen seleccionada",
          "Please, select a source account": "Por favor, seleccione la cuenta de origen",
          "The external number was validated correctly!": "El numero de cuenta fue validado correctamente!",
          "Special instructions": "Instrucciones especiales",
          "Accounts": "Cuentas",
          "Other transfers": "Otras transferencias",
          "Internal Transaction Request": "Solicitud de transferencia Interna",
          "Source Account": "Cuenta de origen",
          "Account Type": "Tipo de cuenta",
          "New contact": "Nuevo contacto",
          "Saved contact": "Contacto guardado",
          "Recent contact": "Contacto reciente",
          "Wadiah Customer": "Cliente de wadiah",
          "Please, enter the the target account": "Por favor, introduzca la cuenta destino",
          "Please, enter at least 3 characters to search and select the country from the owner of the target account": "Por favor, introduzca al menos 3 caracteres para bucar y seleccionar el pais de origen de la cuenta destino",
          "Transaction details": "Detalles de la transferencia",
          "Transaction Request Description": "Descripccion de la transferencia",
          "Target Bank information": "Informacion del banco destino",
          "Target Bank Number": "Número del banco destino",
          "Bank Geographic Info": "Informacion geografica del banco",
          "Zip Code": "Codigo postal",
          "Please, enter the zip code from the bank to which the target account belongs": "Por favor, ingrese el codigo postal del banco al qal ue pertenece la cuenta destino",
          "Pending Authorization": "Autorización pendiente",
          "Transaction Pending": "Transferencia pendiente",
          "Transaction Confirmed": "Transferencia confirmada",
          "There was an error reported by the bank": "Hubo un error reportado por el banco",
          "There was an error": "Hubo un error",
          "Transaction cancelled": "Transferencia cancelada",
          "Transaction voided": "Transferencia anulada",
          "January": "Enero",
          "February": "Febrero",
          "March": "Marzo",
          "April": "Abril",
          "May": "Mayo",
          "June": "Junio",
          "July": "Julio",
          "August": "Agosto",
          "September": "Septiembre",
          "October": "Octubre",
          "November": "Noviembre",
          "December": "Diciembre",
          "at":"a las",
          "Transaction status":"Estado de la transferencia",
          "Transaction from":"Transferido desde",
          "Transaction to":"Transferido a",
          "Summary":"Resumen",
          "History":"Historial",
          "Create New Ticket":"Crear un nuevo ticket",
          "Contact":"Contacto",
          "Bank Transfer":"Transaccion Bancaria",
          "Security":"Seguridad",
          "Profile":"Perfil",
          "Not Found":"Dirección no encontrada",
          "Initial Founds":"Fondos Iniciales",
          "name":"nombre",
          "surname":"apellido",
          "Buy":"Comprar",
          "Sell":"Vender",
          "Deposit":"Depositar",
          "Withdraw":"Retirar",
          "Select Found To Sell":"Seleccione el fondo a vender",
          "Select Found To buy":"Seleccione el fondo a comprar",
          "Specify amount in dollars you want to invest":"Especifique el monto en dolares que desea invertir",
          "Total Balance":"Balance Total",
          "Add Account":"Añadir una cuenta",
          "Last Name":"Apellido",
          "First Name":"Nombre",
          "Hi":"Hola",
          "Reset password":"Reestablecer"
        }
      }
    },
    interpolation: {
      escapeValue: false
    }
  });
export default i18n;


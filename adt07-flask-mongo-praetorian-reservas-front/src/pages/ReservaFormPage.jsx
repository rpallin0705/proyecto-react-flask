import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import MisReservasForm from "../components/MisReservasForm";

const ReservaFormPage = () => {


    return (<>
        <h3>Añadir/Editar una Reserva</h3>
        <MisReservasForm />

    </>);
}

export default ReservaFormPage;
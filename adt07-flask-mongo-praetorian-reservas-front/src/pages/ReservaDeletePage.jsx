import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import MisReservasList from "../components/MisReservasList";
import MisReservasForm from "../components/MisReservasForm";


const ReservaDeletePage = () => {


    return (<>
        <h3>Eliminar una Reserva</h3>
        <MisReservasForm />

    </>);
}

export default ReservaDeletePage;
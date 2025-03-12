import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import HorariosList from "../components/HorariosList";


const ReservaPage = () => {

    return (
        <>
            <h3>Listado de instalaciones </h3>
            < ReservaList />
            <Button as={Link} to="/reserva/add" >
                Añadir nuevo horario
            </Button>
        </>
    );
}

export default ReservaPage;
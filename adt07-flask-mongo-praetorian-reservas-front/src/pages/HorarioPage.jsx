import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import HorariosList from "../components/HorariosList";


const HorarioPage = () => {


    return (<>
        <h3>Listado de instalaciones</h3>
        <HorariosList />
        <Button as={Link} to="/horario/add">
            Añadir nuevo horario
        </Button>
    </>);
}

export default HorarioPage;
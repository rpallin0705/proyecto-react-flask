import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const MisReservasList = () => {
    const [reservas, setReservas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => { 
        const fetchReservas = async () => {
            try {
                const response = await api.get('/reserva');

                const reservasFormateadas = response.data.map(reserva => ({
                    id: reserva._id.$oid,
                    fecha: reserva.fecha,
                    hora_inicio: reserva.horario.hora_inicio.slice(0, 5),
                    hora_fin: reserva.horario.hora_fin.slice(0, 5),
                    instalacion: reserva.horario.instalacion.nombre
                }));

                setReservas(reservasFormateadas);
            } catch (err) {
                console.error("Error al obtener reservas:", err);
                navigate('/login');
            }
        };
        fetchReservas();
    }, []);

    return (
        <Container>
            <h2>Mis Reservas</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>  
                        <th>Instalación</th> 
                        <th>Hora Inicio</th>
                        <th>Hora Fin</th>
                        <th>Fecha</th>
                        <th>Editar</th>
                        <th>Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((reserva) => (
                        <tr key={reserva.id}>
                            <td>{reserva.id}</td>
                            <td>{reserva.instalacion}</td>
                            <td>{reserva.hora_inicio}</td>
                            <td>{reserva.hora_fin}</td>
                            <td>{reserva.fecha}</td>
                            <td>
                                <Button as={Link} to={`/mis-reservas/edit/${reserva.id}`} className="btn-success">
                                    Editar
                                </Button>
                            </td>                            
                            <td>
                                <Button as={Link} to={`/mis-reservas/del/${reserva.id}`} className="btn-danger">
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default MisReservasList;
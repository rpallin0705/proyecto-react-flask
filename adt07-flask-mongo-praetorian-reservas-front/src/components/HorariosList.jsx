import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const HorariosList = () => {
    const [horarios, setHorarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const response = await api.get('/horario');

                const corregidoOid = response.data.map(item => ({
                    ...item,
                    _id: item._id.$oid,
                    hora_inicio: item.hora_inicio.slice(0, 5), 
                    hora_fin: item.hora_fin.slice(0, 5), 
                    instalacion: {
                        ...item.instalacion,
                        _id: item.instalacion._id?.$oid || item.instalacion._id
                    }
                }));

                setHorarios(corregidoOid);
            } catch (err) {
                console.error("Error al obtener horarios:", err);
                navigate('/login');
            }
        };
        fetchHorarios();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = horarios.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => {
        if (currentPage < Math.ceil(horarios.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Container>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Hora Inicio</th>
                        <th>Hora Fin</th>
                        <th>Instalación</th>
                        <th>Editar</th>
                        <th>Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((horario) => (
                        <tr key={horario._id}>
                            <td>{horario._id}</td>
                            <td>{horario.hora_inicio}</td>
                            <td>{horario.hora_fin}</td>
                            <td>{horario.instalacion?.nombre || "Sin instalación"}</td>
                            <td>
                                <Button as={Link} to={`/horarios/edit/${horario._id}`} className="btn-success">
                                    Editar
                                </Button>
                            </td>
                            <td>
                                <Button as={Link} to={`/horarios/del/${horario._id}`} className="btn-danger">
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-center mt-3">
                <Button onClick={prevPage} disabled={currentPage === 1}>Anterior</Button>
                <span className="mx-3">Página {currentPage} de {Math.ceil(horarios.length / itemsPerPage)}</span>
                <Button onClick={nextPage} disabled={currentPage === Math.ceil(horarios.length / itemsPerPage)}>Siguiente</Button>
            </div>
        </Container>
    );
};

export default HorariosList;
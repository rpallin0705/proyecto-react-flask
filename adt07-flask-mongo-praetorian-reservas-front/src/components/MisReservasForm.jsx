import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const MisReservasForm = () => {
    let { _id } = useParams();
    
    // Estados del formulario
    const [fecha, setFecha] = useState('');
    const [instalacion, setInstalacion] = useState('');
    const [horario, setHorario] = useState('');
    const [horarios, setHorarios] = useState([]);
    const [instalaciones, setInstalaciones] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const ruta = useLocation();

    const estado = () => {
        if (ruta.pathname.includes('add')) return 'add';
        if (ruta.pathname.includes('del')) return 'del';
        if (ruta.pathname.includes('edit')) return 'edit';
    };

    useEffect(() => {
        const fetchInstalaciones = async () => {
            try {
                const response = await api.get('/instalacion');
                setInstalaciones(response.data);
            } catch (err) {
                setError('Error cargando instalaciones');
                console.error(err);
            }
        };
        fetchInstalaciones();
    }, []);

    useEffect(() => {
        if (instalacion) {
            const fetchHorarios = async () => {
                try {
                    const response = await api.get('/horario');
                    const horariosFiltrados = response.data.filter(h => {
                        const idInstalacionHorario = h.instalacion._id.$oid || h.instalacion._id;
                        return idInstalacionHorario === instalacion;
                    });
                    setHorarios(horariosFiltrados);
                } catch (err) {
                    setError('Error cargando horarios');
                    console.error(err);
                }
            };
            fetchHorarios();
        } else {
            setHorarios([]);
            setHorario('');
        }
    }, [instalacion]);

    useEffect(() => {
        if (estado() !== 'add') {
            const fetchReserva = async () => {
                try {
                    const response = await api.get(`/reserva/${_id}`);
                    const data = response.data;

                    setFecha(new Date(data.fecha.$date).toISOString().split('T')[0]);
                    setInstalacion(data.horario.instalacion._id.$oid || data.horario.instalacion._id);
                    setHorario(data.horario._id.$oid || data.horario._id);
                } catch (err) {
                    setError('No se puede cargar la reserva');
                    console.error(err);
                }
            };
            fetchReserva();
        }
    }, [_id]);

    const manejaForm = async (event) => {
        event.preventDefault();
        try {
            const reservaData = { fecha, horario };

            if (estado() === 'add') {
                await api.post('/reserva', reservaData);
            } else {
                await api.put(`/reserva/${_id}`, reservaData);
            }

            navigate('/mis-reservas');
        } catch (err) {
            setError('No se puede completar la petición');
            console.error(err);
        }
    };

    const deleteForm = async (event) => {
        event.preventDefault();
        try {
            await api.delete(`/reserva/${_id}`);
            navigate('/reservas');
        } catch (err) {
            setError('No se puede completar la petición');
            console.error(err);
        }
    };

    const manejaAtras = (event) => {
        event.preventDefault();
        navigate(-1);
    };

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>ID:</Form.Label>
                <Form.Control type="text" disabled value={_id} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Fecha:</Form.Label>
                <Form.Control
                    type="date"
                    value={fecha}
                    disabled={estado() === 'del'}
                    onChange={(e) => setFecha(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Instalación:</Form.Label>
                <Form.Select
                    value={instalacion}
                    disabled={estado() === 'del'}
                    onChange={(e) => setInstalacion(e.target.value)}
                >
                    <option value="">Selecciona una instalación</option>
                    {instalaciones.map(inst => (
                        <option key={inst._id.$oid || inst._id} value={inst._id.$oid || inst._id}>
                            {inst.nombre}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Horario:</Form.Label>
                <Form.Select
                    value={horario}
                    disabled={estado() === 'del' || !instalacion}
                    onChange={(e) => setHorario(e.target.value)}
                >
                    <option value="">Selecciona un horario</option>
                    {horarios.map(h => (
                        <option key={h._id.$oid || h._id} value={h._id.$oid || h._id}>
                            {h.hora_inicio.slice(0, 5)} - {h.hora_fin.slice(0, 5)}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                {
                    {
                        'add': <Button className="btn-success" onClick={manejaForm}>Crear</Button>,
                        'edit': <Button className="btn-success" onClick={manejaForm}>Actualizar</Button>,
                        'del': <Button className="btn-danger" onClick={deleteForm}>Eliminar</Button>
                    }[estado()]
                }
                <Button as={Link} onClick={manejaAtras}>Cancelar</Button>
            </Form.Group>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Form>
    );
};

export default MisReservasForm;
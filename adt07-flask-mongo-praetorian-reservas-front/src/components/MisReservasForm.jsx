import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const ReservaForm = () => {
    let { _id } = useParams();

    const [fecha, setFecha] = useState('');
    const [hora_inicio, setHoraInicio] = useState('');
    const [hora_fin, setHoraFin] = useState('');
    const [instalacion, setInstalacion] = useState('');
    const [usuario, setUsuario] = useState('');

    const [instalaciones, setInstalaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const ruta = useLocation();

    const estado = () => {
        if (ruta.pathname.includes('add')) return 'add';
        if (ruta.pathname.includes('del')) return 'del';
        if (ruta.pathname.includes('edit')) return 'edit';
    };

    const manejaForm = async (event) => {
        event.preventDefault();
        try {
            const reservaData = { fecha, hora_inicio, hora_fin, instalacion, usuario };

            if (estado() === 'add') {
                await api.post('/reserva', reservaData);
            } else {
                await api.put(`/reserva/${_id}`, reservaData);
            }

            navigate('/reservas');
        } catch (err) {
            setError('No se puede completar la petición');
            console.log(err);
        }
    };

    const deleteForm = async (event) => {
        event.preventDefault();
        try {
            await api.delete(`/reserva/${_id}`);
            navigate('/reservas');
        } catch (err) {
            setError('No se puede completar la petición');
            console.log(err);
        }
    };

    const manejaAtras = (event) => {
        event.preventDefault();
        navigate(-1);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [instResponse, userResponse] = await Promise.all([
                    api.get('/instalacion'),
                    api.get('/usuario')
                ]);
                setInstalaciones(instResponse.data);
                setUsuarios(userResponse.data);
            } catch (err) {
                setError('Error cargando instalaciones y usuarios');
                console.log(err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (estado() !== 'add') {
            const fetchReserva = async () => {
                try {
                    const response = await api.get(`/reserva/${_id}`);
                    const data = response.data;

                    setFecha(new Date(data.fecha.$date).toISOString().split('T')[0]); 
                    setHoraInicio(data.horario.hora_inicio);
                    setHoraFin(data.horario.hora_fin);
                    setInstalacion(data.horario.instalacion._id);
                    setUsuario(data.usuario._id);
                } catch (err) {
                    setError('No se puede cargar la reserva');
                    console.log(err);
                }
            };
            fetchReserva();
        }
    }, [_id]);

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
                <Form.Label>Hora Inicio:</Form.Label>
                <Form.Control
                    type="time"
                    value={hora_inicio}
                    disabled={estado() === 'del'}
                    onChange={(e) => setHoraInicio(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Hora Fin:</Form.Label>
                <Form.Control
                    type="time"
                    value={hora_fin}
                    disabled={estado() === 'del'}
                    onChange={(e) => setHoraFin(e.target.value)}
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
                <Form.Label>Usuario:</Form.Label>
                <Form.Select
                    value={usuario}
                    disabled={estado() === 'del'}
                    onChange={(e) => setUsuario(e.target.value)}
                >
                    <option value="">Selecciona un usuario</option>
                    {usuarios.map(user => (
                        <option key={user._id.$oid || user._id} value={user._id.$oid || user._id}>
                            {user.username}
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

export default ReservaForm;

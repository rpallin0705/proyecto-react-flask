import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const manejaRegistro = async (event) => {
        event.preventDefault();
        setError('');

        try {
            await api.post('/register', { username, email, password });
            navigate('/login'); 
        } catch (err) {
            console.error(err);
            setError('Error al registrar usuario');
        }
    };

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Nombre de Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Button onClick={manejaRegistro}>Registrarse</Button>
            </Form.Group>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Form>
    );
};

export default Register;

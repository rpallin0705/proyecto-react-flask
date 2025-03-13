# Modificación de la Base de Datos y Automatización con Docker

## Cambios en el Modelo de Reservas  
Se ha modificado la estructura de la base de datos para que las **reservas** no almacenen al usuario embebido, sino que solo contengan una **referencia al `_id` del usuario**.  
Esto evita la duplicación de datos y asegura que en la consulta de reservas no se pase información innecesaria.

## Automatización del Script en Docker  
Se ha configurado **Docker Compose** para que **cargue automáticamente la base de datos** al iniciarse, sin necesidad de intervención manual.

Sin embargo, el script que actualiza los usuarios en las reservas **no se ejecutaba correctamente durante la inicialización** (causa desconocida).  
Para solucionar esto, se ha creado un servicio adicional llamado **`mongo-seed`**, que ejecuta un **script post-inicialización** (`post-init.js`) tras montar la base de datos.

---

## Docker Compose  
A continuación, se muestra el archivo `docker-compose.yml` con la configuración de los servicios:

```yaml
version: '3.1'
services:
  mongo:
    image: mongo
    restart: "no"
    ports: 
      - 27017:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${ADMIN_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${ADMIN_PASSWORD}
      MONGO_INITDB_DATABASE: deporte 
    volumes:
      - ./mongo-init:/docker-entrypoint-initdb.d  

  mongo-express:
    image: mongo-express
    restart: "no"
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: ${ADMIN_USERNAME}      
      ME_CONFIG_MONGODB_ADMINPASSWORD: ${ADMIN_PASSWORD}
      ME_CONFIG_MONGODB_URL: mongodb://${ADMIN_USERNAME}:${ADMIN_PASSWORD}@mongo:27017/
      ME_CONFIG_BASICAUTH: "false"

  mongo-seed:
    image: mongo
    depends_on:
      - mongo
    volumes:
      - ./mongo-init:/mongo-init
    restart: "no"
    command: >
      sh -c "sleep 10 && mongo mongodb://${ADMIN_USERNAME}:${ADMIN_PASSWORD}@mongo:27017/deporte /mongo-init/post-init.js"
```

post.init.js
```
db = db.getSiblingDB('deporte');

db.reservas.find().forEach((reserva) => {
    if (!reserva.usuario || !reserva.usuario.username) return; 

    const username = reserva.usuario.username; 
    db.reservas.updateOne({ _id: reserva._id }, { $unset: { usuario: "" } }); 

    const usuario = db.usuarios.findOne({ username: username });

    if (usuario) {
        db.reservas.updateOne(
            { _id: reserva._id },
            { $set: { usuario: usuario._id } }
        );
    } else {
        print(`Usuario ${username} no encontrado en la BD`);
    }
});
```

# 📌 Documentación de Endpoints de la API

## **Horarios (`/api/horario`)**
| Método  | Endpoint                      | Descripción                          | Autenticación |
|---------|--------------------------------|--------------------------------------|---------------|
| `GET`   | `/api/horario`                 | Obtiene todos los horarios          | ✅ Requerida  |
| `GET`   | `/api/horario/<horario_id>`    | Obtiene un horario por ID           | ✅ Requerida  |
| `DELETE`| `/api/horario/<horario_id>`    | Elimina un horario por ID           | ✅ Requerida  |

---

## **Instalaciones (`/api/instalacion`)**
| Método  | Endpoint                           | Descripción                           | Autenticación |
|---------|------------------------------------|---------------------------------------|---------------|
| `GET`   | `/api/instalacion`                 | Obtiene todas las instalaciones      | ✅ Requerida  |
| `GET`   | `/api/instalacion/<instalacion_id>` | Obtiene una instalación por ID       | ✅ Requerida  |
| `POST`  | `/api/instalacion`                 | Crea una nueva instalación           | ✅ Requerida  |
| `PUT`   | `/api/instalacion/<instalacion_id>` | Actualiza una instalación por ID     | ✅ Requerida  |
| `DELETE`| `/api/instalacion/<instalacion_id>` | Elimina una instalación por ID       | ✅ Requerida  |

---

## **Reservas (`/api/reserva`)**
| Método  | Endpoint                     | Descripción                                        | Autenticación |
|---------|------------------------------|--------------------------------------------------|---------------|
| `GET`   | `/api/reserva`                | Obtiene todas las reservas del usuario autenticado | ✅ Requerida  |
| `GET`   | `/api/reserva/<reserva_id>`   | Obtiene una reserva por ID (verifica permisos)   | ✅ Requerida  |
| `POST`  | `/api/reserva`                | Crea una nueva reserva                           | ✅ Requerida  |
| `PUT`   | `/api/reserva/<reserva_id>`   | Actualiza una reserva (solo fecha y horario)    | ✅ Requerida  |
| `DELETE`| `/api/reserva/<reserva_id>`   | Elimina una reserva por su ID                   | ✅ Requerida  |

---


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
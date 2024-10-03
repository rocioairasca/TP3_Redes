# Proyecto de Microservicio gRPC y REST con MongoDB

Este proyecto implementa un sistema de gestión de tareas utilizando microservicios basados en gRPC y un microservicio REST. La base de datos utilizada es MongoDB, donde se almacenan las tareas. Los microservicios permiten realizar operaciones sobre las mismas y obtener estadísticas a través de gRPC.

## Características

- **Microservicio REST**: Para la creación, lectura, actualización y eliminación de tareas (CRUD).
- **Microservicio gRPC**: Para obtener estadísticas de las tareas, como el promedio de tareas completadas, pendientes y en progreso.
- **MongoDB**: Base de datos no relacional para almacenar las tareas.
- **Axios**: Para hacer solicitudes al microservicio REST desde gRPC.
- **Postman**: Se utiliza para probar las solicitudes gRPC y REST.

## Tecnologías utilizadas

- Node.js
- gRPC
- REST API
- MongoDB
- Axios
- ProtoBuf

## Instalación

Sigue los pasos a continuación para instalar y ejecutar el proyecto en tu entorno local:

### 1. Clonar el repositorio

```bash
git clone https://github.com/rocioairasca/TP3_Redes.git
cd TP3_Redes
```

### 2. Instalar dependencias

npm install

### 3. Configurar las variables de entorno

**Archivo .env**

# URL de la conexión a MongoDB
```bash
DB_URI="mongodb+srv://roairasca:rocio1234@tp3redes.q08xn.mongodb.net/"
```

# Puertos de conexión para el API REST
```bash
PORT=3000
PORT2=3001
```

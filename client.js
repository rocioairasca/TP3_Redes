// importacion de librerias
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

// importacion del .proto
const PROTO_PATH = path.join(process.cwd(), 'simple.proto');

// Cargar el archivo .proto desde PROTO_PATH usando la funcion loadSync de ProtoLoader
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// convierte el objeto packageDefinition en un formato que pueda ser utilizado por gRPC usando loadPackageDefinition
// una vez cargado packageDefinition, extrae el servicio TaskService de nuestro .proto y lo define como taskProto
const taskProto = grpc.loadPackageDefinition(packageDefinition).TaskService;

// aca crea el cliente gRPC en la direccion especificada, con credenciales no cifradas, apuntando a nuestro servicio taskProto
const client = new taskProto('localhost:50051', grpc.credentials.createInsecure());

// Función para obtener el total de tareas
client.GetTotalTasks({}, (error, response) => {
  if (!error) {
    console.log('Total de tareas:', response.total);
  } else {
    console.error('Error al obtener el total de tareas:', error);
  }
});

// Funcion para obtener el promedio de tareas completadas
client.GetCompletedTasksAverage({}, (error, response) => {
  if (!error) {
    console.log('Porcentaje de tareas completadas:', response.average, "%");
  } else {
    console.error('Error al obtener el promedio de tareas completadas:', error);
  }
});

// Funcion para obtener el promedio de tareas pendientes
client.GetPendingTasksAverage({}, (error, response) => {
  if (!error) {
    console.log('Porcentaje de tareas pendientes:', response.average, "%");
  } else {
    console.error('Error al obtener promedio de tareas pendientes:', error);
  }
});

// Funcion para obtener el promedio de tareas en progreso
client.GetInProgressTasksAverage({}, (error, response) => {
  if (!error) {
    console.log('Porcentaje de tareas en progreso:', response.average, "%");
  } else {
    console.error('Error al obtener promedio de tareas en progreso:', error);
  }
});

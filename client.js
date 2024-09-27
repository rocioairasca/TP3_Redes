import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(process.cwd(), 'simple.proto');

// Cargar el archivo .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const taskProto = grpc.loadPackageDefinition(packageDefinition).TaskService;

// Creo un cliente gRPC
const client = new taskProto('localhost:50051', grpc.credentials.createInsecure());

// Funcion para obtener el promedio de tareas completadas
client.GetCompletedTasksAverage({}, (error, response) => {
  if (!error) {
    console.log('Promedio de tareas completadas:', response.average);
  } else {
    console.error('Error al obtener el promedio de tareas completadas:', error);
  }
});

// Funcion para obtener el promedio de tareas pendientes
client.GetPendingTasksAverage({}, (error, response) => {
  if (!error) {
    console.log('Promedio de tareas pendientes:', response.average);
  } else {
    console.error('Error al obtener promedio de tareas pendientes:', error);
  }
});

// Funcion para obtener el promedio de tareas en progreso
client.GetInProgressTasksAverage({}, (error, response) => {
  if (!error) {
    console.log('Promedio de tareas en progreso:', response.average);
  } else {
    console.error('Error al obtener promedio de tareas en progreso:', error);
  }
});

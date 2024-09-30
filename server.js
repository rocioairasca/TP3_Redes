// importacion de librerias
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import axios from 'axios';

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
const taskProto = grpc.loadPackageDefinition(packageDefinition);

// definimos la URL de nuestro microservicio REST
const REST_API_URL = 'http://localhost:3001/tareas';

// funcion que obtiene las tareas desde la API con una solicitud GET
async function fetchTasks() {
  try {
    const response = await axios.get(REST_API_URL);
    console.log(response);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error al obtener las tareas de MicroREST:', error);
    throw new Error('Error al obtener las tareas');
  }
}

// funcion que obtiene el numero total de tareas existentes en nuestra BD
async function getTotalTasks(call, callback) {
  try {
    const tasks = await fetchTasks();
    const total = tasks.length;
    callback(null, { total });
  } catch (error) {
    callback(error, null);
  }
}

// funcion que obtiene el numero total de tareas en estado "completada"
async function getCompletedTasksAverage(call, callback) {
  try {
    const tasks = await fetchTasks();
    const completedTasks = tasks.filter(task => task.estado === 'completada');
    const average = (completedTasks.length / tasks.length) * 100 || 0;
    callback(null, { average });
  } catch (error) {
    callback(error, null);
  }
}

// funcion que obtiene el numero total de tareas en estado "pendiente"
async function getPendingTaskAverage(call, callback) {
  try {
    const tasks = await fetchTasks();
    const pendingTasks = tasks.filter(task => task.estado === 'pendiente');
    const average = (pendingTasks.length / tasks.length) * 100 || 0;
    callback(null, { average });
  } catch (error) {
    callback(error, null);
  }
}

// funcion que obtiene el numero total de tareas en estado "en progreso"
async function getInProgressTasksAverage(call, callback) {
  try {
    const tasks = await fetchTasks();
    const inProgressTasks = tasks.filter(task => task.estado === 'en progreso');
    const average = (inProgressTasks.length / tasks.length) * 100 || 0;
    callback(null, { average });
  } catch (error) {
    callback(error, null);
  }
}

// funcion principal que instancia el servidor gRPC y registra las funciones dentro de nuestro servicio taskProto/TaskService
function main() {
  const server = new grpc.Server();
  server.addService(taskProto.TaskService.service, { 
    GetCompletedTasksAverage: getCompletedTasksAverage,
    GetPendingTasksAverage: getPendingTaskAverage,
    GetInProgressTasksAverage: getInProgressTasksAverage,
    GetTotalTasks: getTotalTasks,
  });

  // aca crea el servidor gRPC en la IP especificada, con credenciales no cifradas
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Servidor gRPC escuchando en el puerto 50051');
  });
}

// llamada a la funcion para iniciar el servidor
main();
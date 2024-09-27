import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import axios from 'axios';

const PROTO_PATH = path.join(process.cwd(), 'simple.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const taskProto = grpc.loadPackageDefinition(packageDefinition);

const REST_API_URL = 'http://localhost:3001/tareas';

function fetchTasks() {
  try {
    const response = axios.get(REST_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las tareas de MicroREST:', error);
    throw new Error('Error al obtener las tareas');
  }
}

function getCompletedTasksAverage(call, callback) {
  try {
    const tasks = fetchTasks();
    const completedTasks = tasks.filter(task => task.estado === 'completada');
    const average = completedTasks.length / tasks.length;
    callback(null, { average });
  } catch (error) {
    callback(error, null);
  }
}

function getPendingTaskAverage(call, callback) {
  try {
    const tasks = fetchTasks();
    const pendingTasks = tasks.filter(task => task.estado === 'pendiente');
    const average = pendingTasks.length / tasks.length;
    callback(null, { average });
  } catch (error) {
    callback(error, null);
  }
}

function getInProgressTasksAverage(call, callback) {
  try {
    const tasks = fetchTasks();
    const inProgressTasks = task.filter(task => task.estado === 'en progreso');
    const average = inProgressTasks.length / tasks.length;
    callback(null, { average });
  } catch (error) {
    callback(error, null);
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(taskProto.TaskService.service, { 
    GetCompletedTasksAverage: getCompletedTasksAverage,
    GetPendingTasksAverage: getPendingTaskAverage,
    GetInProgressTasksAverage: getInProgressTasksAverage,
  });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Servidor gRPC escuchando en el puerto 50051');
  });
}

main();
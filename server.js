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

async function getTotalTasks(call, callback) {
  try {
    const tasks = await fetchTasks();
    const total = tasks.length;
    callback(null, { total });
  } catch (error) {
    callback(error, null);
  }
}

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

function main() {
  const server = new grpc.Server();
  server.addService(taskProto.TaskService.service, { 
    GetCompletedTasksAverage: getCompletedTasksAverage,
    GetPendingTasksAverage: getPendingTaskAverage,
    GetInProgressTasksAverage: getInProgressTasksAverage,
    GetTotalTasks: getTotalTasks,
  });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Servidor gRPC escuchando en el puerto 50051');
  });
}

main();
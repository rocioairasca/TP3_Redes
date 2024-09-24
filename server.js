require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

const cors = require('cors');
app.use(cors());

const PROTO_PATH = path.join(process.cwd(), 'simple.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const simpleProto = grpc.loadPackageDefinition(packageDefinition).SimpleService;

function add(call, callback) {
  const { number1, number2 } = call.request;
  const result = number1 + number2;
  callback(null, { result });
}


function main() {
  const server = new grpc.Server();
  server.addService(simpleProto.service, { add });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Servidor gRPC escuchando en el puerto 50051');
  });
}

main();
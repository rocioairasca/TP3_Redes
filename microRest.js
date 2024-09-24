import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());

const PORT2 = process.env.PORT2;

// Conectando a MongoDB
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB')).catch(err => console.error('No se pudo conectar a MongoDB', err));

// Definir el esquema y modelo de Tarea
const tareaSchema = new mongoose.Schema({
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'en progreso', 'completada'],
      default: 'pendiente',
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    }
});

const Tarea = mongoose.model('Tarea', tareaSchema);

// Endpoint para crear una nueva tarea
app.post('/tareas', async (req, res) => {
  try {
    // Crear una nueva instancia de Tarea con los datos enviados en el cuerpo de la solicitud
    const nuevaTarea = new Tarea({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      estado: req.body.estado || 'pendiente', // Estado opcional
    });

    // Guardar la tarea en la base de datos
    const tareaGuardada = await nuevaTarea.save();
    
    // Responder con la tarea guardada
    res.status(201).json(tareaGuardada);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(500).json({ message: 'Error al crear la tarea' });
  }
});

app.listen(PORT2, () => {
    console.log(`El microservicio Rest esta corriendo en el puerto ${PORT2}`);
});
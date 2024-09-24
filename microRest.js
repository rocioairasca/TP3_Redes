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

// Endpoint para obtener todas las tareas
app.get('/tareas', async (req, res) => {
    try {
      const tareas = await Tarea.find(); // Busca todas las tareas en la colección
      res.status(200).json(tareas);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      res.status(500).json({ message: 'Error al obtener las tareas' });
    }
});

// Endpoint para eliminar una tarea por _id
app.delete('/tareas/:_id', async (req, res) => {
    try {
      const tareaEliminada = await Tarea.findByIdAndDelete(req.params._id);
      if (!tareaEliminada) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
      res.status(200).json({ message: 'Tarea eliminada correctamente', tarea: tareaEliminada });
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
});

// Endpoint para actualizar el estado de una tarea por _id
app.patch('/tareas/:_id/estado', async (req, res) => {
    const { estado } = req.body; // Obtener el nuevo estado del cuerpo de la solicitud
  
    // Validar el estado
    if (!estado || !['pendiente', 'en progreso', 'completada'].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido. Debe ser "pendiente", "en progreso" o "completada".' });
    }
  
    try {
      const tareaActualizada = await Tarea.findByIdAndUpdate(
        req.params._id,
        { estado }, // Actualizar solo el estado
        { new: true, runValidators: true } // `new: true` devuelve el documento actualizado
      );
  
      if (!tareaActualizada) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
  
      res.status(200).json({ message: 'Estado de la tarea actualizado correctamente', tarea: tareaActualizada });
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      res.status(500).json({ message: 'Error al actualizar el estado de la tarea' });
    }
});  

app.listen(PORT2, () => {
    console.log(`El microservicio Rest esta corriendo en el puerto ${PORT2}`);
});
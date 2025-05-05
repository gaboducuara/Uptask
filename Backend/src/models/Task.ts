import mongoose, { Schema, Document, Types } from 'mongoose'

//Objeto para el estado de las tareas
const taskStatus = {
  PENDING: 'pending',
  ON_HOLD: 'onHold',
  IN_PROGRESS: 'inProgress',
  UNDER_REVIEW: 'underReview',
  COMPLETED: 'completed'
} as const

// Forma para que el taskStatus solo reciba la constante de 'completed','underReview','pending', 'onHold', 'inProgress',
export type taskStatus = typeof taskStatus[keyof typeof taskStatus]
export interface ITask extends Document {
  name: string
  description: string
  project: Types.ObjectId
  status: taskStatus
}
export const TaskSchema: Schema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  //Cada Documento debe tener un ObjectID
  project: {
    type: Types.ObjectId,
    ref: 'Project'
  },
  status: {
    type: String,
    enum: Object.values(taskStatus),
    default: taskStatus.PENDING
  }
}, { timestamps: true })

const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task
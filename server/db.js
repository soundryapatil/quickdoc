require('dotenv').config();
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGODB_URI;
let useMongo = false;
let mongoose = null;
let Models = {};

const dataFile = path.join(__dirname, 'data.json');

// Setup lowdb-style simple JSON store (file-based) when Mongo not configured
const ensureDataFile = () => {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ users: [], doctors: [], appointments: [] }, null, 2));
  }
};

const readData = () => JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const writeData = (d) => fs.writeFileSync(dataFile, JSON.stringify(d, null, 2));

const connect = async () => {
  if (MONGO_URI) {
    try {
      mongoose = require('mongoose');
      await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      useMongo = true;
      // define schemas
      const UserSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String, phone: String, address: String, gender: String, dob: String }, { timestamps: true });
      const DoctorSchema = new mongoose.Schema({ name: String, specialty: String, about: String, experience: String, fees: Number, picture: String, available: Boolean, userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, degree: String, address1: String, address2: String }, { timestamps: true });
      const AppointmentSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, date: Date, slot: String, status: String, payment: { type: String, default: 'CASH' } }, { timestamps: true });
      Models.User = mongoose.model('User', UserSchema);
      Models.Doctor = mongoose.model('Doctor', DoctorSchema);
      Models.Appointment = mongoose.model('Appointment', AppointmentSchema);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Failed to connect to MongoDB, falling back to file DB.', err.message || err);
      useMongo = false;
      ensureDataFile();
    }
  } else {
    ensureDataFile();
  }
};

// Helper functions that work with either Mongo models or file DB
const addUser = async (user) => {
  if (useMongo) return Models.User.create(user);
  const d = readData();
  const id = ((d.users.length ? parseInt(d.users[d.users.length-1].id || d.users[d.users.length-1]._id || 0) : 0) + 1).toString();
  const u = { 
    id, 
    name: user.name, 
    email: user.email, 
    password: user.password, 
    role: user.role || 'user',
    phone: user.phone || '',
    address: user.address || '',
    gender: user.gender || '',
    dob: user.dob || '',
    createdAt: new Date(), 
    updatedAt: new Date() 
  };
  d.users.push(u); writeData(d); return u;
};

const findUserByEmail = async (email) => {
  if (useMongo) return Models.User.findOne({ email });
  const d = readData();
  return d.users.find(u => u.email === email) || null;
};

const addDoctor = async (doc) => {
  if (useMongo) return Models.Doctor.create(doc);
  const d = readData();
  const id = ((d.doctors.length ? parseInt(d.doctors[d.doctors.length-1].id || d.doctors[d.doctors.length-1]._id || 0) : 0) + 1).toString();
  const item = { id, ...doc, available: doc.available !== false, createdAt: new Date(), updatedAt: new Date() };
  d.doctors.push(item); writeData(d); return item;
};

const listDoctors = async (filter = {}) => {
  if (useMongo) return Models.Doctor.find(filter).sort({ createdAt: -1 });
  const d = readData();
  let out = d.doctors.slice().reverse();
  if (filter.specialty) out = out.filter(x => x.specialty === filter.specialty);
  return out;
};

const findDoctorById = async (id) => {
  if (useMongo) return Models.Doctor.findById(id);
  const d = readData();
  return d.doctors.find(x => (x.id === id || x._id === id)) || null;
};

const updateDoctor = async (id, changes) => {
  if (useMongo) return Models.Doctor.findByIdAndUpdate(id, changes, { new: true });
  const d = readData();
  const idx = d.doctors.findIndex(x => (x.id === id || x._id === id));
  if (idx === -1) return null;
  d.doctors[idx] = { ...d.doctors[idx], ...changes, updatedAt: new Date() };
  writeData(d);
  return d.doctors[idx];
};

const addAppointment = async (appt) => {
  if (useMongo) return Models.Appointment.create({ ...appt, payment: appt.payment || 'CASH' });
  const d = readData();
  const id = ((d.appointments.length ? parseInt(d.appointments[d.appointments.length-1].id || d.appointments[d.appointments.length-1]._id || 0) : 0) + 1).toString();
  const item = { id, user: appt.user, doctor: appt.doctor, date: appt.date, slot: appt.slot, status: 'booked', payment: appt.payment || 'CASH', createdAt: new Date(), updatedAt: new Date() };
  d.appointments.push(item); writeData(d); return item;
};

const findAppointmentsByUser = async (userId) => {
  if (useMongo) return Models.Appointment.find({ user: userId }).populate('doctor');
  const d = readData();
  return d.appointments.filter(a => a.user === userId).map(a => {
    const doctor = d.doctors.find(doc => doc.id === a.doctor || doc._id === a.doctor) || null;
    return { ...a, doctor };
  });
};

const listAllAppointments = async () => {
  if (useMongo) return Models.Appointment.find().populate('doctor').populate('user');
  const d = readData();
  return d.appointments.map(a => {
    const doctor = d.doctors.find(doc => doc.id === a.doctor || doc._id === a.doctor) || null;
    const user = d.users.find(u => u.id === a.user || u._id === a.user) || null;
    return { ...a, doctor, user };
  }).reverse();
};

const cancelAppointment = async (id, userId) => {
  if (useMongo) {
    const a = await Models.Appointment.findById(id);
    if (!a) return null;
    if (a.user.toString() !== userId) throw new Error('Forbidden');
    a.status = 'cancelled'; await a.save(); return a;
  }
  const d = readData();
  const idx = d.appointments.findIndex(a => (a.id === id || a._id === id));
  if (idx === -1) return null;
  if (d.appointments[idx].user !== userId) throw new Error('Forbidden');
  d.appointments[idx].status = 'cancelled'; writeData(d); return d.appointments[idx];
};

const updateUser = async (id, changes) => {
  if (useMongo) return Models.User.findByIdAndUpdate(id, changes, { new: true });
  const d = readData();
  const idx = d.users.findIndex(u => (u.id === id || u._id === id));
  if (idx === -1) return null;
  d.users[idx] = { ...d.users[idx], ...changes, updatedAt: new Date() };
  writeData(d); return d.users[idx];
};

const updateAppointment = async (id, changes, userId, asAdmin = false) => {
  if (useMongo) {
    const a = await Models.Appointment.findById(id);
    if (!a) return null;
    if (!asAdmin && a.user.toString() !== userId) throw new Error('Forbidden');
    Object.assign(a, changes);
    await a.save();
    return a;
  }
  const d = readData();
  const idx = d.appointments.findIndex(a => (a.id === id || a._id === id));
  if (idx === -1) return null;
  if (!asAdmin && d.appointments[idx].user !== userId) throw new Error('Forbidden');
  d.appointments[idx] = { ...d.appointments[idx], ...changes, updatedAt: new Date() };
  writeData(d); return d.appointments[idx];
};

const findUserById = async (id) => {
  if (useMongo) return Models.User.findById(id);
  const d = readData();
  return d.users.find(u => (u.id === id || u._id === id)) || null;
};

module.exports = {
  connect,
  useMongo: () => useMongo,
  addUser,
  findUserByEmail,
  findUserById,
  updateUser,
  addDoctor,
  listDoctors,
  findDoctorById,
  addAppointment,
  findAppointmentsByUser,
  listAllAppointments,
  cancelAppointment,
  updateAppointment,
  updateDoctor,
  dataFile
};

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// connect DB (MONGODB_URI optional)
db.connect().catch(err => console.error('DB connect error', err));

app.use('/auth', require('./routes/auth'));
app.use('/doctors', require('./routes/doctors'));
app.use('/appointments', require('./routes/appointments'));
app.use('/admin', require('./routes/admin'));
app.use('/doctor', require('./routes/doctor'));

app.get('/', (req, res) => res.json({ ok: true, msg: 'Prescripto API' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

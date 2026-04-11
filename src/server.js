const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { attachCurrentUser } = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const questRoutes = require('./routes/questRoutes');
const shopRoutes = require('./routes/shopRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const eventRoutes = require('./routes/eventRoutes');

console.log('NODE_ENV in db.js =', process.env.NODE_ENV);
console.log('DATABASE_URL in db.js =', process.env.DATABASE_URL);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax' }
  })
);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(attachCurrentUser);

app.get('/', (req, res) => {
  if (!req.currentUser) return res.redirect('/login');
  return res.redirect('/dashboard');
});

app.use(authRoutes);
app.use(dashboardRoutes);
app.use('/quests', questRoutes);
app.use('/shop', shopRoutes);
app.use('/events', eventRoutes);
app.use(reviewsRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('500', { title: 'Server error', error: err });
});
/*
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
*/
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
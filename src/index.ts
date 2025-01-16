import express from 'express';
import logger from 'morgan';
import indexRoutes from './routes/index.route';
import config from './config/config';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(indexRoutes);

process.env.TZ = 'America/Santiago'; // Aquí se establece la zona horaria

const port = config.port || 3000;
app.listen(port, () => {
    console.log('Server running OK on port:', port);
});

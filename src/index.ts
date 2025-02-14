import express from 'express';
import logger from 'morgan';
import indexRoutes from './routes/index.route';
import config from './config/config';

const app = express();
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack); // Log del error en la consola

    res.status(err.status || 500).json({
        code: err.status || 500,
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err : undefined, // Solo en desarrollo
    });
});

app.use(indexRoutes);

process.env.TZ = 'America/Santiago'; // Aquí se establece la zona horaria

const port = config.port || 3000;
app.listen(port, () => {
    console.log('Server running OK on port:', port);
});

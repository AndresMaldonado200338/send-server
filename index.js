const express = require('express');
const port = 3000;
const app = express();
const serverDeploy = require('./server-deploy');

app.use(express.static('html'));

app.get('/server-deploy', async (req, res) => {
    try {
        await serverDeploy();
        res.send('Despliegue exitoso.');
    } catch (error) {
        console.error('Error de despliegue:', error);
        res.status(500).send('Despliegue fallido');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

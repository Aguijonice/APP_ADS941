const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Configuración del EventEmitter
const EventEmitter = require('events');
const pageViewEmitter = new EventEmitter();

// Manejador de eventos para páginas visitadas
pageViewEmitter.on('pageView', (page) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] Página visitada: ${page}`);
});

// Middleware modificado para filtrar solo rutas HTML
app.use((req, res, next) => {
  const requestedPath = req.path;
  
  // Solo registrar estas rutas principales
  const mainRoutes = ['/', '/inicio', '/contacto', '/productos'];
  
  if (mainRoutes.includes(requestedPath)) {
    const page = requestedPath === '/' ? '/inicio' : requestedPath;
    pageViewEmitter.emit('pageView', page);
  }
  
  next();
});

// Servir archivos estáticos (sin registro de estos accesos)
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Rutas principales
app.get(['/', '/inicio'], (req, res) => {
  res.sendFile(path.join(__dirname, 'Barberia_pagina.html'));
});

app.get('/contacto', (req, res) => {
  res.sendFile(path.join(__dirname, 'contacto.html'));
});

app.get('/productos', (req, res) => {
  res.sendFile(path.join(__dirname, 'productos.html'));
});

app.listen(PORT, () => {
  console.log(`\nServidor funcionando en http://localhost:${PORT}`);
  console.log('Rutas principales:');
  console.log(`- Inicio:    http://localhost:${PORT}/inicio`);
  console.log(`- Contacto:  http://localhost:${PORT}/contacto`);
  console.log(`- Productos: http://localhost:${PORT}/productos\n`);
});
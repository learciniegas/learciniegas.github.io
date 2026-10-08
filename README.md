# Periféricos · prototipo funcional

Tienda de ejemplo en HTML, CSS y JS vanilla (datos quemados, carrito en `localStorage`).

## Arranque rápido
1. Abre esta carpeta en VS Code (**File → Open Folder**) y acepta instalar las extensiones recomendadas.
2. Clic derecho en `index.html` → **Open with Live Server** (puerto 5500).
   Alternativa en terminal: `npm install` y `npm start` (necesita Node.js 18 o superior).
3. Depurar: **F5** abre Chrome con el sitio y permite usar puntos de interrupción.

## Imágenes pendientes
Exporta desde Figma a `img/` como PNG: `k60`, `m30`, `a75`, `t45`, `r45`, `a60`.

## Probar el flujo de compra
Catálogo → Agregar al carrito → Carrito → Pagar todo → Acceso (cualquier correo y contraseña) →
Envío → Pago → Confirmación → Seguimiento.
Tarjeta válida de prueba: `4242 4242 4242 4242`, vencimiento futuro (12/30) y código 123.

## Comandos
- `npm run lint`: revisa el JS con ESLint.
- `npm run format`: da formato con Prettier.

## Estructura
```
index.html  producto.html  envio.html  pago.html  confirmacion.html
seguimiento.html  registro.html  ayuda.html  resena.html
css/styles.css   js/app.js   img/
```

## Checklist de accesibilidad antes de entregar
- [ ] Todo se puede usar solo con teclado y el foco siempre se ve.
- [ ] Lighthouse → Accessibility sin errores.
- [ ] Contraste de texto de al menos 4,5:1 (DevTools → inspeccionar color).
- [ ] Probado con lector de pantalla (NVDA en Windows o VoiceOver en Mac).
- [ ] Vista a 320 px de ancho sin scroll horizontal.

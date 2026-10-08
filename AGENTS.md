# Reglas del proyecto (para cualquier agente de IA)

Prototipo de tienda de periféricos: HTML + CSS + JS vanilla, sin frameworks, datos quemados.

## Código
- HTML semántico (`header`, `nav`, `main`, `aside`, `h1`/`h2`), un `<h1>` por página.
- CSS en `css/styles.css` con variables en `:root`. Sin estilos en línea nuevos.
- JS sin librerías. Datos en memoria o `localStorage`; no hay servidor.
- Textos en español de Ecuador. Precios en USD con formato `$60`.
- No usar `innerHTML` con texto escrito por el usuario (usar `textContent`).

## Accesibilidad (WCAG 2.2 AA)
- Foco visible (`:focus-visible`), objetivos táctiles de al menos 24 × 24 px.
- Cada `input` con `<label>`; errores con texto, `aria-invalid` y `aria-describedby`.
- Estados con texto, no solo con color. Avisos dinámicos con `role="status"` o `role="alert"`.
- Probar todo con teclado (Tab, Enter, Espacio, Esc).

## Flujo de trabajo
- Cambios pequeños, un tema por vez. Explicar qué archivos se tocan.
- Tras cambiar JS: `npm run lint`.
- Si se reorganiza a MVC: `js/models`, `js/views`, `js/controllers`; el modelo no toca el DOM.

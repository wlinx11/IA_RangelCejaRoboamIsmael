# Reporte Wally

## Cascade Trainer GUI

Similar a lo que realizamos con el proyecto de las emociones, necesitamos un dataset para poder trabajar aquí. Busqué muchas imágenes de "Buscando a Wally", seleccioné 2 imágenes y entre estas 2 generé 600 recortes de ellas, 300 donde aparecía Wally (algunas en blanco y negro, otras con un ángulo un poco distinto o resolución diferente) y otras 300 donde no aparece Wally, todas de 50x50 píxeles. Dividí ambas en sus 2 carpetas: "P" de positivo (si está Wally) y "N" de negativo (no está Wally), estas 2 dentro de una sola carpeta. Y ahora sí, con la ayuda del Cascade Trainer GUI inserté estas carpetas con un porcentaje de uso de imagen positiva del 80%. Después de un rato se generó el archivo "cascade.xml".

## Ejecutando el código

Modificando el código usado en el detector de caras, lo adaptamos para que detecte imágenes esta vez, e ingresamos el xml generado en Cascade Trainer: `rostro = cv.CascadeClassifier(r'C:\Users\ASUS\Desktop\universidad\IA\wally2\classifier\cascade.xml')` Y con la siguiente línea: `rostros = rostro.detectMultiScale(gray, 1.3, 3)` Podemos modificar la escala de grises, facilitando así la búsqueda de Wally dentro de las imágenes. Finalmente, ejecutando el código con una imagen de "Buscando a Wally" cargada, tratará de encontrarlo encerrándolo en un cuadro. Podemos precisar esta búsqueda en caso de que falle (cosa que pasa muy seguido) ajustando los valores de `rostros = rostro.detectMultiScale(gray, 1.3, 3)` que son la escala de las imágenes y el número de vecinos que buscará.

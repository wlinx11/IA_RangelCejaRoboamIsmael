# Reporte CNN

### Generación del código

Para el clasificador de imágenes usé las instrucciones de la documentación brindada en el PDF "APRENDE MACHINE LEARNING" en la sección de "Clasificación de Imágenes en Python". Copié el código y descargué la base de datos de deportes para ejecutarlo todo, pero tuve problemas con las librerías y versiones de Python. Una vez instaladas y solucionadas, el código funcionaba.

### Obtención de las nuevas imágenes

Usé FFmpeg y códigos Python para la obtención de imágenes para el nuevo dataset sobre los riesgos propuestos, dejando reproducir un video y marcando qué lapsos de tiempo tomarían captura, siendo estas muy cortas, y tratando de que tuvieran la menor cantidad de ruido posible. Una vez con las capturas puestas en sus respectivas carpetas con sus nombres (asalto, incendio, inundación, robo y tornado), todas estas carpetas tienen una cantidad de entre 6,000 y 12,000 imágenes, todas de 28x28. Luego, con estos cambios, sustituí las rutas de las carpetas y aumenté los epochs en 30 y se logró ejecutar correctamente.
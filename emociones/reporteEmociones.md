# Reporte emociones

## Obtención del código y dataset

Usando el código brindado para el programa para tomar imágenes, junté varios amigos y les tomé varias fotos en donde recrearían las emociones con sus caras. Estas fotos las almacené en carpetas por cada emoción (Feliz, Neutral, Sorpresa y Triste), teniendo entre 1,200 y 1,800 imágenes por carpeta. Una vez con esto, en el código de detector de imágenes.

# LBPH

## Obtención del código y dataset

Este código lo modifiqué a partir de unos códigos que el profesor ya tenía. Contaba con la parte de detección de rostros, así que únicamente lo ajusté para que capture fotograma por fotograma enfocado en la cara, gracias también al `haarcascade_frontalface_alt.xml`.

## Explicación del código

El código en Python utiliza la biblioteca OpenCV para entrenar un modelo de reconocimiento facial utilizando el algoritmo LBPH (Local Binary Patterns Histograms).

Primero, establecí la ruta al conjunto de datos de imágenes de caras con `dataSet = 'C://Users//ASUS//Desktop//universidad//IA//emociones//Emociones'` para obtener una lista de todos los archivos en ese directorio, que asumí son imágenes de caras.

Después, inicialicé tres listas vacías: `labels`, `facesData` y `label`. `labels` y `facesData` se llenarán con los datos de las imágenes y sus respectivas etiquetas. `label` es un contador que incremento para cada cara en el conjunto de datos.

El código luego entra en un bucle `for` que recorre cada cara en la lista de caras. Para cada cara, crea una ruta al archivo de la imagen, luego abre esa imagen y la añade a la lista `facesData`. También añado la etiqueta actual a la lista `labels`. Luego incremento la etiqueta.

Luego guardo este reconocedor entrenado en un archivo llamado `carasLBPHFace.xml` para su uso futuro.

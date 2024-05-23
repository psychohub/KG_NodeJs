Instalación
-----------

Antes de iniciar el proyecto, asegúrate de ejecutar el siguiente comando para instalar las dependencias:

npm install   

Inicialización de la Base de Datos
----------------------------------

El archivo initDB.js proporciona una forma conveniente de reiniciar la base de datos con datos iniciales. Para ejecutarlo, utiliza el siguiente comando:

node initDB.js   

Se te pedirá confirmación antes de proceder con la reinicialización de la base de datos. Ten en cuenta que esto eliminará todos los datos existentes y los reemplazará con los datos iniciales definidos en el archivo src/data/anuncios.json.

Servicio de Generación de Thumbnails
------------------------------------

El archivo thumbnailService.js implementa un servicio de generación de thumbnails utilizando la biblioteca Jimp. Este servicio se ejecuta como un microservicio independiente y responde a solicitudes para generar thumbnails de imágenes.

Para iniciar el servicio de thumbnails, ejecuta el siguiente comando:

node thumbnailService.js   

El servicio escuchará las solicitudes de generación de thumbnails y generará thumbnails de tamaño 100x100 píxeles para las imágenes especificadas.

Pruebas de API con Supertest
----------------------------

Se ha incluido un conjunto de pruebas de API utilizando la biblioteca Supertest. Estas pruebas se encuentran en el archivo api.test.js y cubren las siguientes funcionalidades:

*   Obtención de una lista de anuncios
    
*   Creación de un nuevo anuncio con una imagen ficticia
    

Para ejecutar las pruebas, utiliza el siguiente comando:

npm test   

Las pruebas se ejecutarán utilizando Jest y se mostrará el resultado en la consola.

Operaciones Disponibles
-----------------------

El API de Nodepop proporciona las siguientes operaciones:

1.  **Lista de Anuncios**
    
    *   Endpoint: /api/ads/anuncios
        
    *   Método: GET
        
    *   Descripción: Obtiene una lista de anuncios con posibilidad de paginación. Permite filtrar por tag, tipo de anuncio (venta o búsqueda), rango de precio y nombre de artículo.
        
    *   Parámetros de consulta:
        
        *   tag: Filtra los anuncios por tag.
            
        *   tipo: Filtra los anuncios por tipo de anuncio (venta o búsqueda).
            
        *   precioMin: Establece el precio mínimo de los anuncios.
            
        *   precioMax: Establece el precio máximo de los anuncios.
            
        *   nombre: Filtra los anuncios por nombre de artículo.
            
        *   page: Número de página para la paginación.
            
        *   limit: Número de resultados por página.
            
2.  **Creación de Anuncio**
    
    *   Endpoint: /api/ads/anuncios/registrar
        
    *   Método: POST
        
    *   Descripción: Crea un nuevo anuncio con los datos proporcionados en el cuerpo de la solicitud.
        
    *   Parámetros en el cuerpo de la solicitud:
        
        *   nombre: Nombre del artículo.
            
        *   venta: Tipo de anuncio (venta o búsqueda).
            
        *   precio: Precio del artículo en caso de ser una oferta de venta, o el precio que el solicitante estaría dispuesto a pagar en caso de ser una búsqueda.
            
        *   foto: Foto del artículo (archivo de imagen).
            
        *   tags: Tags del anuncio.
            

Aspectos Técnicos
-----------------

*   El API está desarrollado en Node.js utilizando el framework Express.
    
*   Se utiliza MongoDB como base de datos para almacenar los anuncios.
    
*   Se emplea Mongoose como ODM (Object Data Modeling) para interactuar con la base de datos MongoDB.
    
*   Se implementan validaciones de datos utilizando express-validator.
    
*   Se gestiona el almacenamiento de imágenes utilizando el middleware multer.
    
*   Se utiliza el patrón de diseño MVC (Modelo-Vista-Controlador) para organizar el código.
    
*   El API se ejecuta en el puerto 3000 por defecto, pero se puede cambiar en el archivo de configuración.
    
*   Se incluye un middleware para el manejo de errores que devuelve respuestas JSON con los errores detectados.
    
*   El proyecto se ejecuta con el comando npm run start.

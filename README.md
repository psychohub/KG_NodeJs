## Despliegue en AWS

El proyecto ha sido desplegado en Amazon Web Services (AWS) utilizando una instancia EC2. Se han configurado dos aplicaciones:

1. **Aplicación Node.js (Backend)**
   - URL: [http://psychohubweb16.duckdns.org/](http://psychohubweb16.duckdns.org/)
   - Esta aplicación sirve la API REST y maneja la lógica del backend.

2. **Aplicación React (Frontend)**
   - URL: [http://3.12.197.189/](http://3.12.197.189/)
   - Esta es la interfaz de usuario construida con React.

### Configuración del Servidor

- Se utiliza PM2 como gestor de procesos para mantener la aplicación Node.js en ejecución continuamente.
- Nginx está configurado como proxy inverso para manejar las peticiones HTTP y redirigirlas a la aplicación Node.js correspondiente.

### Servicio de Archivos Estáticos

Los archivos estáticos son servidos directamente por Nginx para mejorar el rendimiento. Como ejemplo, se puede acceder a una imagen estática en la siguiente URL:

[http://3.12.197.189/public/images/Bicicleta.jpg](http://3.12.197.189/public/images/Bicicleta.jpg)

Esta imagen se sirve con una cabecera HTTP personalizada `X-Owner` cuyo valor es "psychohub", que corresponde al nombre de usuario de GitHub del desarrollador.

### Acceso por IP vs Nombre de Dominio

- Al acceder mediante la dirección IP del servidor ([http://3.12.197.189/](http://3.12.197.189/)), se carga la aplicación React (frontend).
- Al acceder mediante el nombre de dominio ([http://psychohubweb16.duckdns.org/](http://psychohubweb16.duckdns.org/)), se accede a la API de Node.js (backend).


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

Documentación de la API con Swagger
----------------------------

La documentación de la API se genera automáticamente utilizando Swagger. Puedes revisar la documentación completa de la API accediendo a la siguiente URL después de iniciar el servidor:

http://localhost:3001/api-docs
    
Esta documentación proporciona detalles sobre todos los endpoints disponibles, incluyendo los parámetros de entrada, las respuestas esperadas y ejemplos de uso
    

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
    
*   El API se ejecuta en el puerto 3001 por defecto, pero se puede cambiar en el archivo de configuración.
    
*   Se incluye un middleware para el manejo de errores que devuelve respuestas JSON con los errores detectados.
    
*   El proyecto se ejecuta con el comando npm run start.

Comandos
-----------------

*  Iniciar el servidor

npm run start

*  Inicializar la base de datos

node initDB.js

*  Iniciar el servicio de thumbnails

node thumbnailService.js

*  Ejecutar pruebas

npm test

*  Ver la documentación de la API

http://localhost:3001/api-docs

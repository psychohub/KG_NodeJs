## Operaciones Disponibles

El API de Nodepop proporciona las siguientes operaciones:

1. **Lista de Anuncios**
   - Endpoint: `/api/ads/anuncios`
   - Método: GET
   - Descripción: Obtiene una lista de anuncios con posibilidad de paginación. Permite filtrar por tag, tipo de anuncio (venta o búsqueda), rango de precio y nombre de artículo.
   - Parámetros de consulta:
     - `tag`: Filtra los anuncios por tag.
     - `tipo`: Filtra los anuncios por tipo de anuncio (venta o búsqueda).
     - `precioMin`: Establece el precio mínimo de los anuncios.
     - `precioMax`: Establece el precio máximo de los anuncios.
     - `nombre`: Filtra los anuncios por nombre de artículo.
     - `page`: Número de página para la paginación.
     - `limit`: Número de resultados por página.

2. **Creación de Anuncio**
   - Endpoint: `/api/ads/anuncios/registrar`
   - Método: POST
   - Descripción: Crea un nuevo anuncio con los datos proporcionados en el cuerpo de la solicitud.
   - Parámetros en el cuerpo de la solicitud:
     - `nombre`: Nombre del artículo.
     - `venta`: Tipo de anuncio (venta o búsqueda).
     - `precio`: Precio del artículo en caso de ser una oferta de venta, o el precio que el solicitante estaría dispuesto a pagar en caso de ser una búsqueda.
     - `foto`: Foto del artículo (archivo de imagen).
     - `tags`: Tags del anuncio.

## Aspectos Técnicos
- El API está desarrollado en Node.js utilizando el framework Express.
- Se utiliza MongoDB como base de datos para almacenar los anuncios.
- Se emplea Mongoose como ODM (Object Data Modeling) para interactuar con la base de datos MongoDB.
- Se implementan validaciones de datos utilizando express-validator.
- Se gestiona el almacenamiento de imágenes utilizando el middleware multer.
- Se utiliza el patrón de diseño MVC (Modelo-Vista-Controlador) para organizar el código.
- El API se ejecuta en el puerto 3000 por defecto, pero se puede cambiar en el archivo de configuración.
- Se incluye un middleware para el manejo de errores que devuelve respuestas JSON con los errores detectados.
- El proyecto se ejecuta con el comando `npm run dev`.

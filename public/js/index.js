 // Función para manejar Internacionalización
 function changeLanguage(language) {
    // Asegúrate de que la cookie expira adecuadamente, por ejemplo, en un día.
    var date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toUTCString();
  
    document.cookie = `language=${language}; path=/; expires=` + expires;
    location.reload(); 
  }
  
      // Función para manejar la autenticación y almacenar el token
   async function authenticate(email, password) {
    try {
      const response = await fetch('/api/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/api/ads/anuncios';
      } else {
        alert(data.error || 'Error al autenticar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
    // Obtener el token JWT del almacenamiento local
    document.addEventListener('DOMContentLoaded', function() {
      const token = localStorage.getItem('token');
     
      if (token) {
        fetch('/api/ads/anuncios', {
          headers: {
            'Authorization': 'Bearer ' + token  
          }
        })
        .then(response => {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
          } else {
            return response.text();
          }
        })
        .then(data => {
          if (typeof data === 'string') {
            document.body.innerHTML = data; 
          } else {
            const anunciosContainer = document.getElementById('anuncios-container');
            anunciosContainer.innerHTML = '';
            data.forEach(anuncio => {  
              const anuncioElement = document.createElement('li');
              anuncioElement.innerHTML = `
                <h2>${anuncio.nombre}</h2>
                <p>${anuncio.descripcion}</p>
                <p>Precio: ${anuncio.precio}</p>
              `;
              anunciosContainer.appendChild(anuncioElement);
            });
          }
        })
        .catch(error => console.error('Error al obtener anuncios:', error));
      } else {
        window.location.href = '/login'; 
      }
    });
    
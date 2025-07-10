# TFG-FrontEnd

Aplicación frontend para una plataforma de aprendizaje de lengua de signos española construida con [Angular CLI](https://github.com/angular/angular-cli) 19. Permite a los usuarios buscar y compartir vídeos de signando en LSE, desafiarse con cuestionarios y gestionar sus perfiles. El proyecto utiliza Bootstrap para el estilo y Ngx Loading Bar para la retroalimentación de navegación.

## 
Para ejecutar el proyecto es necesario tener también ejecutando [TFG-Backend](https://github.com/HeliotGonzalez/TFG-Backend) y [TFG-Websockets](https://github.com/HeliotGonzalez/TFG-Websockets) y, en Docker, tener Redis instalado y ejecutándose.

## Servidor de desarrollo

Instala las dependencias con `npm install` y lanza la aplicación con:

```bash
ng serve
```

Una vez en funcionamiento, abre el navegador en `http://localhost:4200/`. La aplicación se recargará automáticamente cuando los archivos cambien.

## Componentes principales

La aplicación está organizada en componentes independientes de Angular. Algunos de los más destacados son:

- **AppComponent** – Componente raíz que controla la visibilidad del encabezado y la barra de progreso de navegación.
- **AboutUsComponent** – Muestra los miembros del proyecto con su rol y avatar.
- **AlfabetoComponent** – Permite a los usuarios navegar palabras alfabéticamente y cargar sus vídeos.
- **AyudaComponent** – Preguntas frecuentes filtradas mediante un cuadro de búsqueda.
- **ChatComponent** – Conversaciones en tiempo real usando WebSockets con notificaciones de mensajes no leídos.
- **ChekingVideosComponent** – Expertos revisan vídeos pendientes y los aceptan o rechazan con comentarios.
- **ColaborateComponent** – Página estática que anima a la colaboración con enlaces útiles.
- **DailyChallengeComponent** – Genera un desafío diario de vídeo y almacena los resultados del usuario.
- **DictionaryComponent** – Diccionario personal de vídeos con opciones de filtrado y ordenación.
- **ExpertStatsComponent** – Muestra estadísticas para usuarios expertos y vídeos pendientes.
- **FlashccardsComponent** – Tarjetas interactivas para practicar vocabulario.
- **HeaderComponent** – Barra de navegación principal con opciones de usuario y cierre de sesión.
- **HomepageComponent** – Página de inicio con barra de búsqueda y detección de permisos de administrador.
- **ListOfSuggestionsComponent** – Administradores revisan y ocultan sugerencias de usuarios.
- **ListOfUsersComponent** – Lista paginada de usuarios donde los administradores pueden banearlos.
- **LoginComponent** – Formulario de inicio de sesión con recuperación de contraseña por email y OTP.
- **RegisterComponent** – Registro de nuevos usuarios con verificación de código por email.
- **SearchContactsComponent** – Encuentra usuarios que aún no son amigos y enlaza a su perfil.
- **SearchingBarComponent** – Barra de búsqueda de palabras que emite resultados de la API a otros componentes.
- **SendSuggestionComponent** – Envía sugerencias para la aplicación con validación y mensajes de éxito/error.
- **ModifyProfileComponent** – Editor de perfil con formulario reactivo y subida de avatar.
- **MyVideosCorrectedComponent** – Vídeos del usuario que han sido revisados por otros.
- **NotificationsComponent** – Notificaciones en tiempo real para solicitudes de amistad, chats y vídeos corregidos.
- **PersonalQuizzComponent** – Genera cuestionarios personalizados a partir de vídeos y muestra la puntuación.
- **ProfileComponent** – Muestra el perfil de un usuario, sus vídeos y permite enviar o aceptar solicitudes de amistad.
- **RandomWordComponent** – Lista palabras aleatorias con sus vídeos más votados y permite cargar más.
- **RecentlyUploadedComponent** – Muestra vídeos subidos recientemente por cualquier usuario.
- **StudyComponent** – Ofrece autoevaluación con vídeos aleatorios y enlaces a otros modos de estudio como flashcards.
- **ThemesComponent** – Filtra vídeos por etiquetas obtenidas de la API.
- **UploadedByMyFriendsComponent** – Lista vídeos subidos por los amigos del usuario.
- **VideoCreatorComponent** – Formulario para enviar una URL de vídeo con solicitud de corrección opcional.
- **VideoDisplayerComponent** – Muestra vídeos asociados a una palabra dada.
- **VideoListComponent** – Lista genérica con acciones de me gusta/no me gusta, guardado en el diccionario e informe.
- **ViewReportsComponent** – Vista de administrador para gestionar informes de vídeos y banearlos u ocultarlos.
- **WordListComponent** – Lista de palabras paginada en lotes de cinco.
- **WordRegisterComponent** – Registra nuevas palabras con validación y envío a la API.
- **WordsBySearchComponent** – Página de resultados de búsqueda de palabras que permite nuevas consultas sin recargar.
- **WordsRequiredComponent** – Palabras que aún necesitan vídeos subidos por la comunidad.

Estos componentes trabajan juntos para ofrecer búsqueda de vídeos, herramientas de estudio, comunicación en tiempo real y funciones de gestión de usuarios para la plataforma de aprendizaje de lenguaje de señas.

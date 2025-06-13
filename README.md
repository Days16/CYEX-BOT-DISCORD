# CYEX BOT

Bot de Discord para la gestión económica de un clan de Minecraft.

## Características

- Sistema de gestión de tesorería del clan
- Seguimiento de contribuciones de miembros
- Registro de ingresos y gastos
- Estadísticas financieras del clan

## Requisitos

- Node.js v16.9.0 o superior
- Firebase (Firestore)
- Token de bot de Discord

## Instalación

1. Clona este repositorio
2. Instala las dependencias:
```bash
npm install
```
3. Copia el archivo `.env.example` a `.env` y configura tus variables de entorno:
```bash
cp .env.example .env
```
4. Edita el archivo `.env` con tus credenciales:
   - Token de Discord
   - Configuración de Firebase

## Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Firestore Database
3. Obtén las credenciales de configuración
4. Configura las reglas de seguridad de Firestore

## Uso

Para iniciar el bot en modo desarrollo:
```bash
npm run dev
```

Para iniciar el bot en producción:
```bash
npm start
```

## Comandos

- `/clanfinances` - Muestra el estado financiero del clan
- `/treasury add` - Añade dinero a la tesorería del clan
- `/treasury remove` - Retira dinero de la tesorería del clan

## Estructura del Proyecto

```
src/
├── commands/     # Comandos del bot
├── config/       # Configuración (Firebase)
├── models/       # Modelos de datos
└── index.js      # Archivo principal
``` 
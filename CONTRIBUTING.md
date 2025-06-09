# Guía de Contribución

¡Gracias por tu interés en contribuir a este proyecto! Esta guía te ayudará a entender cómo puedes participar y contribuir.

---
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Índice**

- [¿Quién puede participar?](#%C2%BFqui%C3%A9n-puede-participar)
- [¿Qué puedo hacer?](#%C2%BFqu%C3%A9-puedo-hacer)
- [Configuración del entorno local](#configuraci%C3%B3n-del-entorno-local)
- [Cómo agregar o eliminar idiomas](#c%C3%B3mo-agregar-o-eliminar-idiomas)
- [Hero images](#hero-images)
- [Cómo actualizar las iniciativas](#c%C3%B3mo-actualizar-las-iniciativas)
- [Cómo actualizar el FAQ](#c%C3%B3mo-actualizar-el-faq)
- [Buenas prácticas](#buenas-pr%C3%A1cticas)
- [Añádete a la lista de "Contributors"](#a%C3%B1%C3%A1dete-a-la-lista-de-contributors)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Dudas y soporte](#dudas-y-soporte)
- [Licencia](#licencia)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## ¿Quién puede participar?

En esta iniciativa puede contribuir cualquier persona (no hace falta dinamizar una comunidad).


## ¿Qué puedo hacer?

|Ejemplo|Badges|
|---|---|
|Compartiendo ideas para mejorar este proyecto|🤔 `ideas`
|Asegurando que la web está actualizada (iniciativas, FAQ, etc)|🖋 `content`
|Ayudando a mejorar este proyecto activamente para que siga evolucionando|📆 `projectManagement`
|Informando o trabajando en cuestiones relacionadas con la accesibilidad|♿️`a11y`
|Reportando o corrigiendo bugs en el código|🐛 `bug`
|Ayudando a mejorar las funcionalidades de la web, dependencias|💻 `code`
|Mejorando el logotipo/iconografía/diseño visual/etc.|🎨 `design`
|Mejorando la usabilidad|📓 `userTesting`
|Respondiendo [preguntas en los issues](https://github.com/ComBuildersES/ComBuildersES.github.io/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen)|💬 `question`
|Ayudando con la documentación del proyecto, esta guía de contribución, etc| 📖 `doc`
|Ayudando a traducir la web, para público que no hable español|🌍 `translation`
|Revisando PRs|👀 `review`
|Escribiendo tests|⚠️ `test`
|Preparando un vídeos para incluir en la web|📹 `video`
|Ayudando a mantener el repositorio|🚧 `maintenance`

Intentamos que en las iniciativas siempre haya algunos issues etiquetados como [help wanted](https://github.com/ComBuildersES/ComBuildersES.github.io/issues?q=sort%3Aupdated-desc+is%3Aopen+label%3A%22help+wanted%22) y [good first](https://github.com/ComBuildersES/ComBuildersES.github.io/issues?q=sort%3Aupdated-desc+is%3Aopen+label%3A%22good+first+issue%22) issue. Si no encuentras ninguno o si se te ocurre algo más no dudes en preguntarlo, proponerlo [en los issues](https://github.com/ComBuildersES/ComBuildersES.github.io/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen).


## Configuración del entorno local

1. Clona el repositorio:
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Cómo agregar o eliminar idiomas


1. Navega al archivo `src/contexts/LanguageContext.tsx`
2. Para agregar un nuevo idioma:
   - Añade el código del idioma al tipo `Language`:
   ```typescript
   type Language = 'en' | 'es' | 'tu-nuevo-idioma';
   ```
   - Añade las traducciones para el nuevo idioma en el objeto `translations`:
   ```typescript
   const translations = {
     'tu-nuevo-idioma': {
       // Navigation
       'nav.home': 'Traducción',
       // ... resto de traducciones
     }
   };
   ```
   - Añade las traducciones a `src/data/faq.json` y `src/data/initiatives.json`

3. Para eliminar un idioma:
   - Navega al archivo `src/components/LanguageSelector.tsx`
   - Elimina el código del idioma en `languages`
   - Elimina los objetos de traducciones en los tres ficheros de los puntos anteriores.

## Actualizar *hero images*

Actualiza el *array* `heroImages` en `src/pages/Index.tsx` e introduce las imágenes en `public/images/`.

## Actualizar las iniciativas

1. Navega al archivo `src/data/initiatives.json`
2. Cada iniciativa debe seguir este formato:
```json
{
  "id": "identificador-unico",
  "title": {
    "en": "English Title",
    "es": "Título en Español",
  },
  "description": {
    "en": "English description",
    "es": "Descripción en español"
  },
  "image": "public/images/imagen.webp"
}
```

3. Para agregar una nueva iniciativa:

   - Navega al archivo `src/data/initiatives.json`
   - Añade un nuevo objeto al array `initiatives`
   - Asegúrate de incluir todas las traducciones necesarias
   - Proporciona una imagen representativa

4. Para modificar una iniciativa existente:
   - Localiza la iniciativa por su `id`
   - Actualiza los campos necesarios
   - Asegúrate de mantener todas las traducciones actualizadas

5. Para eliminar una iniciativa:
   - Elimina el objeto correspondiente del array `initiatives`

## Cómo actualizar el FAQ

1. Navega al archivo `src/data/faq.json`
2. Cada entrada del FAQ debe seguir este formato:
```json
{
  "id": "identificador-unico",
  "question": {
    "en": "English question",
    "es": "Pregunta en español"
  },
  "answer": {
    "en": "English answer",
    "es": "Respuesta en español"
  }
}
```

3. Para agregar una nueva pregunta:
   - Añade un nuevo objeto al array `faq`
   - Asegúrate de incluir todas las traducciones necesarias
   - Mantén las respuestas concisas y claras

4. Para modificar una entrada existente:
   - Localiza la entrada por su `id`
   - Actualiza la pregunta y/o respuesta
   - Asegúrate de mantener todas las traducciones actualizadas

5. Para eliminar una entrada:
   - Elimina el objeto correspondiente del array `faq`

## Buenas prácticas

1. **Commits**:
   - Usa mensajes de commit descriptivos
   - Sigue el formato: `tipo(alcance): descripción` (tipos: feat, fix, docs, [ver más](https://gist.github.com/kolynzb/2e6a57511e300940773dc2e2fa8c0567#commit-types))
   - Ejemplo: `feat(idiomas): agrega soporte para español`

2. **Pull Requests**:
   - Para las ramas usa el formato: `git checkout -b tu-gh-handler/mejora-o-fix`
   - Incluye una descripción clara de los cambios

3. **Código**:
   - Sigue las convenciones de código existentes
   - Mantén el código limpio y bien documentado

## Añádete a la lista de "Contributors"

Recuerda seguir [las instrucciones para añadir tus contribuciones al repo](https://github.com/ComBuildersES/ComBuildersES.github.io/issues/21).

## Estructura del proyecto

```
src/
├── components/     # Componentes React
├── contexts/      # Contextos de React (LanguageContext)
├── data/          # Datos estáticos (FAQ, iniciativas)
├── services/      # Servicios (miembros)
├── styles/        # Estilos globales
└── utils/         # Utilidades y helpers
```

## Dudas y soporte

Si tienes preguntas o necesitas ayuda:
1. Revisa la documentación existente
2. Abre un issue en GitHub
3. Contacta al equipo de mantenimiento

## Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la misma licencia que el proyecto. 
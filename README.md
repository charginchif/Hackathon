# Comunidad Alerta 🛡️
**Unidos por un entorno más seguro**

Comunidad Alerta es una plataforma integral de prevención, monitoreo y respuesta rápida diseñada para entornos institucionales y educativos (ISSU). El sistema combina inteligencia artificial, monitoreo táctico urbano y control perimetral para garantizar la seguridad de alumnos y autoridades en tiempo real.

## 🎨 Identidad Visual (Paleta de Colores)
La plataforma utiliza una paleta de colores táctica y de alta visibilidad:
- **Naranja (#E37909)**: Color Primario. Utilizado para botones de acción principal, navegación y branding.
- **Rojo (#C51617)**: Color Secundario. Reservado para alertas SOS, emergencias y estados críticos.
- **Hueso (#FFFFFB)**: Color de Fondo. Proporciona una base limpia y profesional (Warm White).
- **Gris (#96939B)**: Color de Acento/Muted. Utilizado para textos secundarios, bordes y elementos de interfaz neutrales.

## 🚀 Misión del Proyecto
Transformar la seguridad institucional mediante una red conectada que permita la detección temprana de riesgos y la respuesta coordinada entre la comunidad y los centros de mando (C5).

## 🛠️ Tecnologías Utilizadas
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS.
- **Backend & Base de Datos**: Firebase (Firestore, Auth, App Hosting).
- **Inteligencia Artificial**: Genkit + Google Gemini (para análisis de incidentes y alertas globales).
- **Componentes UI**: Shadcn UI, Lucide Icons, Framer Motion (para animaciones tácticas).

## 🏗️ Elementos del Sistema (Arquitectura)

### 1. Componentes de Interfaz (UI)
- **`Dashboard.tsx`**: Panel principal que ofrece una vista de "Mi Seguridad" para alumnos o "Dashboard C5" para autoridades. Incluye estadísticas críticas y un mapa táctico urbano integrado con radar.
- **`PerimeterMap.tsx`**: Mapa de entorno urbano vivo con animación de radar. Visualiza calles, edificios, cámaras CCTV y puntos de interés (hospitales, farmacias, parques) alrededor de los planteles con etiquetas visibles.
- **`IncidentManagement.tsx`**: Centro de mando para autoridades donde se gestionan los reportes y se emiten alertas globales generadas por IA.
- **`ReportIncident.tsx`**: Interfaz de usuario para reportar fallas de infraestructura, personas sospechosas o emergencias médicas, incluyendo un botón de pánico SOS de alta prioridad.
- **`AIAssistant.tsx`**: Componente de GenAI que analiza incidentes en tiempo real y sugiere protocolos de acción, contactos relevantes y borradores de comunicación.
- **`AccessControl.tsx` & `StudentAccess.tsx`**: Sistema de bitácora y registro de flujos perimetrales mediante simulación de escaneo biométrico facial.

### 2. Flujos de Inteligencia Artificial (Genkit)
- **`incident-response-assistant.ts`**: Analiza la categoría y descripción de un incidente para proponer una estrategia de respuesta táctica inmediata.
- **`global-alert-generator.ts`**: Genera comunicados oficiales y alertas comunitarias urgentes basadas en el contexto de múltiples incidentes activos.

## 📱 Experiencia Móvil
La plataforma es **100% responsiva**, optimizada con un menú lateral tipo "drawer" y cuadrículas adaptativas para que las alertas y el monitoreo funcionen perfectamente en smartphones.

---
*Desarrollado para la Hackathon de Prevención Escolar.*

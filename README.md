# 🏯 Valhalla Dojo — Sistema de Gestión de Gimnasio

Sistema web completo para la gestión de miembros, membresías y pagos de un gimnasio. Desarrollado con **Kotlin + Spring Boot** en el backend y **React + Vite** en el frontend.

---

## ✨ Funcionalidades

- **Dashboard** con conteo en tiempo real de miembros por estado
- **Registro de miembros** con datos personales y membresía inicial
- **Dos tipos de membresía:**
  - Mensualidad por disciplina (Aikido, Defensa Personal, Esgrima Vikinga, Funcional Militar)
  - Paquetes de clases (1, 6, 8, 10, 12, 16 o 20 clases)
- **Control de clases** con contador y botón para descontar una clase a la vez
- **Renovación de membresía** desde la tabla, con posibilidad de combinar mensualidad + clases
- **Historial de pagos** por miembro
- **Reporte Excel** con 3 hojas: resumen, miembros e historial completo
- **Importación desde Excel** con plantilla descargable y protección contra duplicados
- **Estados automáticos:** Al día · Por vencer · Vencido · Sin membresía · Inactivo

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Backend | Kotlin + Spring Boot |
| Base de datos | PostgreSQL 18 (Docker) |
| Reportes | Apache POI |
| Frontend | React + Vite |
| HTTP client | Axios |
| Build tool | Gradle |

---

## ⚙️ Requisitos previos

- Java 17
- Node.js 18+
- Docker Desktop
- Git

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/chunchiter/Valhalla-Dojo.git
cd Valhalla-Dojo
```

### 2. Levantar la base de datos

```bash
docker compose up -d
```

| Campo | Valor |
|-------|-------|
| Host | localhost |
| Puerto | 5432 |
| Base de datos | gymdb |
| Usuario | gymuser |
| Contraseña | gympass |

### 3. Correr el backend

```bash
./gradlew bootRun
```

Backend disponible en `http://localhost:8080`  
Las tablas se crean automáticamente al iniciar.

### 4. Correr el frontend

```bash
cd gym-frontend
npm install
npm run dev
```

Frontend disponible en `http://localhost:5173`

---

## 📁 Estructura del proyecto

```
Valhalla-Dojo/
├── src/main/kotlin/com/gymapp/gymmanager/
│   ├── controller/        # Endpoints REST
│   ├── service/           # Lógica de negocio
│   ├── repository/        # Acceso a base de datos
│   ├── entity/            # Modelos JPA
│   └── dto/               # Objetos de transferencia
├── gym-frontend/src/
│   ├── components/        # Modales y componentes React
│   ├── App.jsx            # Componente principal
│   └── App.css            # Estilos
├── docker-compose.yml
└── build.gradle.kts
```

---

## 🔌 Endpoints principales

### Miembros
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/members` | Lista todos los miembros |
| POST | `/api/members` | Crea un nuevo miembro |
| PUT | `/api/members/{id}` | Edita un miembro |
| DELETE | `/api/members/{id}` | Elimina un miembro |

### Membresías
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/memberships/member/{id}` | Historial de un miembro |
| POST | `/api/memberships` | Registra un pago |
| PUT | `/api/memberships/{id}/descontar-clase` | Descuenta una clase |

### Reportes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/reports/members` | Descarga reporte Excel |
| GET | `/api/reports/template` | Descarga plantilla de importación |
| POST | `/api/reports/import` | Importa miembros desde Excel |

---

## 🎨 Estados de membresía

| Estado | Color | Condición |
|--------|-------|-----------|
| Al día | 🟢 Verde | Vence en más de 5 días |
| Por vencer | 🟡 Amarillo | Vence en menos de 5 días |
| Vencido | 🔴 Rojo | Fecha de vencimiento pasada |
| Sin membresía | 🔴 Rojo | Sin pagos registrados |
| Inactivo | ⚫ Gris | Marcado como inactivo |

---

## 📊 Reporte Excel

El reporte generado contiene 3 hojas:

- **Resumen** — totales por estado
- **Miembros** — listado con tipo de membresía, estado y colores
- **Historial pagos** — todos los registros con tipo (Mensualidad / Por clases / Inscripción) y detalle

---

## 🗒️ Notas

- Al eliminar un miembro se eliminan automáticamente todas sus membresías
- El estado se calcula en tiempo real comparando con la fecha actual
- El frontend hace proxy al backend en el puerto 8080

---

## 📌 Versión

**V1.1** — Gestión de miembros, mensualidades, paquetes de clases, inscripciones y reportes Excel

# Event Manager — Full Stack Term Project

https://github.com/MehranMoshtagh/CPSC-2600.git

https://cpsc-2600-project.onrender.com


A simple full-stack event management app with event creation, RSVP tracking, filtering, and validation.

**Built with:**  
- Node.js / Express backend  
- MongoDB (Atlas or local) with JSON Schema validation  
- React frontend bundled via Parcel

---

## Features

- **Create events** (name, location, date, description, organizer)  
  - Must be in the future  
  - Name cannot be purely numeric
- **List and filter events** by name, location, and date
- **Clear filters** to reset search
- **View event details**
- **Submit RSVPs** (user name and status: attending / maybe / not attending)  
  - User name cannot be purely numeric
- **Strict schema validation** in MongoDB (with allowance for _id)
- **Frontend / backend separation**; frontend talks to backend API
- **Basic CORS support** for development
- **Defensive error handling** and client feedback

---

## Directory Structure

```
project-root/
├── .env.example              # Example env template
├── README.md
├── server/
│   ├── index.js              # Express entry point
│   ├── db.js                 # Mongo connection + schema setup
│   ├── controllers/
│   │   └── eventsController.js
│   ├── middleware/
│   │   ├── validateEvent.js
│   │   ├── validateRSVP.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── events.js
│   │   └── rsvps.js
│   ├── schemas/
│   │   ├── eventSchema.js
│   │   └── rsvpSchema.js
├── client/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── index.jsx
│       ├── api/
│       │   └── api.js
│       ├── components/       # React components (EventList, EventDetail, Forms, etc.)
│       ├── utils/
│       │   └── formatDate.js
│       └── styles.css
```

---

## Prerequisites

- Node.js (v18+ recommended) and npm
- MongoDB: either local running instance or MongoDB Atlas cluster
- Optional: `curl` for manual API testing (PowerShell users can use `Invoke-RestMethod`)

---

## Setup

### 1. Clone & Install

```sh
git clone <your-repo-url>
cd project-root
```

### 2. Environment

Create a `.env` file (you can copy from `.env.example`) at the `server/` level or root depending on loading:

**Local:**
```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=eventsdb
PORT=3000
```

**Atlas:**
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=eventsdb
PORT=3000
```

> **Important:** Do not commit your real `.env` to source control. Use `.env.example` for templates.

### 3. Backend Install & Run

```sh
cd server
npm install
npm run start    # or: node index.js
```

You should see logs like:
```
✅ Connected to MongoDB
🚀 Server listening on port 3000
```

### 4. Frontend Install & Run

In a separate terminal:

```sh
cd client
npm install
npm run dev
```

Parcel will serve the frontend (usually at [http://localhost:1234](http://localhost:1234)).  
The frontend calls the backend at [http://localhost:3000/api/v1](http://localhost:3000/api/v1).

---

## API Endpoints

### Health Check

```
GET /health
```
Returns:
```json
{ "status": "ok", "timestamp": "..." }
```

### Events

- **List events / filter:**  
  ```
  GET /api/v1/events?name=...&location=...&date=YYYY-MM-DD
  ```
  Returns array of events matching filters (partial regex on name/location, date is day range).

- **Get single event:**  
  ```
  GET /api/v1/events/:id
  ```

- **Create event:**  
  ```
  POST /api/v1/events
  ```
  Body JSON:
  ```json
  {
    "name": "Event Name",
    "location": "Somewhere",
    "date": "2025-08-10T15:00:00.000Z",
    "description": "Optional",
    "organizer": "Organizer Name"
  }
  ```

  **Validations:**
  - name, location, date required
  - name cannot be purely numeric
  - date must be a future date
  - Mongo schema enforces types and required `createdAt` (added automatically)

### RSVPs

- **Submit RSVP:**  
  ```
  POST /api/v1/events/:eventId/rsvp
  ```
  Body JSON:
  ```json
  {
    "userName": "Alice",
    "rsvpStatus": "attending"
  }
  ```

  **Validations:**
  - userName required, not purely numeric
  - rsvpStatus must be one of attending, maybe, not attending
  - timestamp added automatically

- **List RSVPs for event:**  
  ```
  GET /api/v1/events/:eventId/rsvps
  ```

---

## Sample `curl` Usage

**Create event:**
```sh
curl -i -X POST http://localhost:3000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Event","location":"Room 101","date":"2025-08-10T15:00:00.000Z","description":"Sample","organizer":"You"}'
```

**List events:**
```sh
curl http://localhost:3000/api/v1/events
```

**RSVP:**
```sh
curl -i -X POST http://localhost:3000/api/v1/events/<eventId>/rsvp \
  -H "Content-Type: application/json" \
  -d '{"userName":"Alice","rsvpStatus":"attending"}'
```

---

## Frontend Behavior

- Filters are applied client-side and sent as query parameters to the backend.
- “Clear Filters” resets to show all events.
- Event creation form enforces required fields before submit and displays backend errors.
- RSVP form behaves similarly with validation feedback.

---

## Validation Summary

### Event

- **Required:** name, location, date (validated in controller + schema)
- name must include letters (not purely numeric)
- date must be in the future
- Mongo schema requires: name (string), date (Date), location (string), createdAt (auto-added Date); no extra properties allowed except _id.

### RSVP

- **Required:** userName, rsvpStatus
- userName not purely numeric
- rsvpStatus one of: attending, maybe, not attending
- Schema enforces types and required fields; no extra properties.

---

## Deployment Notes

**Build frontend for production:**
```sh
cd client
npm run build
```
Output will go to `../server/public` (per parcel config).

Have the backend serve static frontend:
```js
app.use(express.static('public'));
```

Configure environment variables appropriately in the deployment target.

---

## Troubleshooting

- **Validation errors:** Check server logs for detailed schema failure output.
- **CORS issues:** During dev, the backend allows all origins. In production, tighten `Access-Control-Allow-Origin`.
- **Frontend not seeing API:** Ensure `API_BASE` in `client/src/api/api.js` points to `http://localhost:3000/api/v1` in dev.
- **Stale build:** Delete `.parcel-cache` and re-run `npm run dev`.

---

## Future Improvements

- User identity (persist RSVP name, login)
- Prevent duplicate RSVPs per user/event
- Edit/delete events or RSVPs
- Pagination for large event lists
- Shareable filter links (URL sync)
- Rate limiting / basic auth for event creation
- Tests (Jest/supertest for backend, React testing for frontend)

---

## Example `.env.example`

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=eventsdb
PORT=3000
```


## MediDrive – Test Task - up to 3h ( 45h for Platinum challange )
**Core technologies:** React, Redux Toolkit, TypeScript, MUI, CSS-in-JS, React Hook Form, Yup  
**Task:** Implement a page for managing service logs.

---

### 1. Service Log Creation Form
The user must be able to:
- Create service log drafts so data is saved and can be resumed later.
- Have form fields auto-saved as data is entered.
- Keep all data stored after page reload (e.g., using Redux Toolkit for state and a persist package such as `redux-persist` for storage).

#### Form requirements
**Input fields:**
- `providerId`: string (provider identifier)
- `serviceOrder`: string (service order number)
- `carId`: string (car identifier)
- `odometer (mi)`: number (mileage in miles)
- `engineHours`: number (engine hours)
- `startDate`: string (start date)
- `endDate`: string (end date)
- `type`: enum (`planned`, `unplanned`, `emergency`) (service type)
- `serviceDescription`: string (service description)

**Form functionality:**
- Build the form with **React Hook Form**.
- Use **Yup** for schema-based validation (e.g., required checks, data format validation).
- Auto-save data on every change.
- `startDate` defaults to the current day, and `endDate` defaults to the next day. When `startDate` is changed, `endDate` must automatically update to remain one day later.
- Display draft saving status (e.g., "Saving..." during auto-save and "Draft saved" after successful save).
- Indicate whether a draft is saved (e.g., show a checkmark next to the draft if saved).
- All form data and drafts must remain saved and accessible after page reload (e.g., via `redux-persist`).

**Main buttons:**
- Create Draft
- Delete Draft
- Clear All Drafts
- Create Service Log

---

### 2. Displaying Service Logs
**Display requirements:**
- Service logs must be shown in a table.
- Support search by key fields.
- Support filtering by:
    - `startDate` (date range)
    - `type` (`planned`, `unplanned`, `emergency`)

---

### 3. Editing and Deleting Service Logs
- Ability to edit a service log via a dialog.
- Ability to delete an existing service log.

---

### Additional Requirements
- Code must be well-structured and maintainable.
- Pay special attention to using Redux Toolkit for state management, particularly for drafts and service logs.
- Data must persist after page reload (e.g., using a persist package such as `redux-persist`).
- Use MUI for building the user interface and CSS-in-JS for styling.
- TypeScript must be used for typing all data and components.

---

### Creativity Encouraged
We value a creative approach to solving tasks. Use your imagination and experience to enhance functionality or design. Additional non-standard solutions or improvement suggestions will be a strong plus!

## How to Deploy 
1. Clone the repository and navigate to the project directory.
2. Install dependencies using `npm install` or `yarn install`.
3. Start the development server with `npm start` or `yarn start`.
4. Open your browser and navigate to `http://localhost:5173/` to view the application.
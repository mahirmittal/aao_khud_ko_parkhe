# Database Schema Documentation

## Overview
This project uses **MongoDB** as the primary database with schema validation to ensure data integrity.

## Database: `cg_portal_feedback`

### Collections

#### 1. `users` Collection (User Management)
**Purpose**: Stores system users created through admin dashboard

**Schema Validation**:
```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 50
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  type: {
    type: String,
    required: true,
    enum: ["admin", "Executive", "manager", "Executive"]
  },
  active: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  }
}
```

**Indexes**:
- `username` (unique)
- `type`
- `active`
- `createdAt` (descending)

**Example Document**:
```javascript
{
  "_id": ObjectId("..."),
  "username": "manager1",
  "password": "manager123",
  "type": "manager",
  "active": true,
  "createdAt": ISODate("2025-01-21T..."),
  "updatedAt": ISODate("2025-01-21T...")
}
```

#### 2. `adminC` Collection (Admin Authentication)
**Purpose**: Stores admin credentials for dashboard login

**Schema Validation**:
```javascript
{
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}
```

**Indexes**:
- `username` (unique)

**Example Document**:
```javascript
{
  "_id": ObjectId("..."),
  "username": "admin",
  "password": "admin1234"
}
```

#### 3. `departments` Collection (Department Management)
**Purpose**: Stores government department information and contact details

**Schema Validation**:
```javascript
{
  deptName: {
    type: String,
    required: true,
    unique: true,
    enum: ["Health Department", "Finance Department", "Tax Department"]
  },
  deptEmail: {
    type: String,
    required: true,
    unique: true,
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
  },
  deptContactNo: {
    type: String,
    required: true,
    pattern: "^[0-9]{10}$"
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  }
}
```

**Indexes**:
- `deptName` (unique)
- `deptEmail` (unique)
- `createdAt` (descending)

**Example Document**:
```javascript
{
  "_id": ObjectId("..."),
  "deptName": "Health Department",
  "deptEmail": "health@cg.gov.in",
  "deptContactNo": "7712345001",
  "createdAt": ISODate("2025-01-21T..."),
  "updatedAt": ISODate("2025-01-21T...")
}
```

#### 4. `feedbacks` Collection (Feedback Management)
**Purpose**: Stores citizen feedback and call center interactions

**Schema Validation**:
```javascript
{
  callId: {
    type: String,
    required: true,
    unique: true
  },
  citizenMobile: {
    type: String,
    required: true,
    pattern: "^[0-9]{10}$"
  },
  citizenName: {
    type: String,
    required: true
  },
  queryType: {
    type: String
  },
  satisfaction: {
    type: String,
    required: true,
    enum: ["satisfied", "not-satisfied"]
  },
  description: {
    type: String,
    required: true
  },
  submittedBy: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  }
}
```

**Indexes**:
- `callId` (unique)
- `citizenMobile`
- `submittedAt` (descending)
- `status`

## API Endpoints & Database Operations

### User Management APIs
- **GET** `/api/users` → `db.users.find({})`
- **POST** `/api/users` → `db.users.insertOne(newUser)`
- **PUT** `/api/users/[id]` → `db.users.updateOne({_id}, updatedUser)`
- **DELETE** `/api/users/[id]` → `db.users.deleteOne({_id})`

### Department Management APIs
- **GET** `/api/departments` → `db.departments.find({})`
- **POST** `/api/departments` → `db.departments.insertOne(newDepartment)`
- **PUT** `/api/departments/[id]` → `db.departments.updateOne({_id}, updatedDepartment)`
- **DELETE** `/api/departments/[id]` → `db.departments.deleteOne({_id})`

### Admin Authentication APIs
- **POST** `/api/admin/login` → `db.adminC.findOne({username})`

### Feedback Management APIs
- **GET** `/api/feedback` → `db.feedbacks.find({})`
- **POST** `/api/feedback` → `db.feedbacks.insertOne(newFeedback)`

## Schema Validation Benefits

1. **Data Integrity**: Ensures all required fields are present
2. **Type Safety**: Validates data types (string, boolean, date)
3. **Constraints**: Enforces enums, min/max lengths, patterns
4. **Unique Constraints**: Prevents duplicate usernames
5. **Performance**: Indexes for fast queries

## Database Initialization

Run the MongoDB initialization script to set up schema validation:

```bash
# Connect to MongoDB and run init script
docker exec -i cg_portal_feedback-mongodb-1 mongosh cg_portal_feedback < scripts/init-mongo.js
```

This will:
- Create collections with validation rules
- Set up indexes for performance
- Insert sample data for testing

## Migration Notes

If you need to update the schema:
1. Update the validation rules in `scripts/init-mongo.js`
2. Re-run the initialization script
3. Existing documents that don't match new schema will remain but new inserts will be validated

## Security Considerations

- Passwords are stored as plain text (as requested)
- Username uniqueness enforced at database level
- Schema validation prevents malformed data
- Indexes improve query performance and security

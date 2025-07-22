// MongoDB initialization script
print('Starting MongoDB initialization...');

// Switch to the application database
db = db.getSiblingDB('cg_portal_feedback');

// Create collections with schema validation
print('Creating collections with schema validation...');

// Create feedbacks collection with validation
db.createCollection('feedbacks', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["callId", "citizenMobile", "citizenName", "satisfaction", "description", "submittedBy", "submittedAt", "status"],
      properties: {
        callId: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        citizenMobile: {
          bsonType: "string",
          pattern: "^[0-9]{10}$",
          description: "must be a 10-digit mobile number"
        },
        citizenName: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        queryType: {
          bsonType: "string",
          description: "must be a string"
        },
        satisfaction: {
          bsonType: "string",
          enum: ["satisfied", "not-satisfied"],
          description: "must be either satisfied or not-satisfied"
        },
        description: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        submittedBy: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        submittedAt: {
          bsonType: "date",
          description: "must be a date and is required"
        },
        status: {
          bsonType: "string",
          enum: ["pending", "resolved"],
          description: "must be either pending or resolved"
        },
        createdAt: {
          bsonType: "date",
          description: "must be a date"
        },
        updatedAt: {
          bsonType: "date",
          description: "must be a date"
        }
      }
    }
  }
});

// Create users collection with validation for user management
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "password", "type", "active"],
      properties: {
        username: {
          bsonType: "string",
          minLength: 3,
          maxLength: 50,
          description: "must be a string between 3-50 characters and is required"
        },
        password: {
          bsonType: "string",
          minLength: 6,
          description: "must be a string with minimum 6 characters and is required"
        },
        type: {
          bsonType: "string",
          enum: ["admin", "Executive", "manager", "Executive"],
          description: "must be one of: admin, Executive, manager, Executive"
        },
        active: {
          bsonType: "bool",
          description: "must be a boolean and is required"
        },
        createdAt: {
          bsonType: "date",
          description: "must be a date"
        },
        updatedAt: {
          bsonType: "date",
          description: "must be a date"
        }
      }
    }
  }
});

// Create adminC collection for admin authentication (existing admin credentials)
db.createCollection('adminC', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "password"],
      properties: {
        username: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        password: {
          bsonType: "string",
          description: "must be a string and is required"
        }
      }
    }
  }
});

// Create indexes for better performance
print('Creating indexes...');
db.feedbacks.createIndex({ "callId": 1 }, { unique: true });
db.feedbacks.createIndex({ "citizenMobile": 1 });
db.feedbacks.createIndex({ "submittedAt": -1 });
db.feedbacks.createIndex({ "status": 1 });

// Create unique index for username in users collection
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "type": 1 });
db.users.createIndex({ "active": 1 });
db.users.createIndex({ "createdAt": -1 });

// Create unique index for admin collection
db.adminC.createIndex({ "username": 1 }, { unique: true });

// Insert sample data
db.feedbacks.insertMany([
  {
    callId: "CG001",
    citizenMobile: "9876543210",
    citizenName: "Ramesh Kumar",
    queryType: "Birth Certificate",
    satisfaction: "satisfied",
    description: "Citizen was satisfied with the quick resolution. Birth certificate application was processed successfully and citizen received confirmation.",
    submittedBy: "EXE001",
    submittedAt: new Date("2024-01-15T10:30:00Z"),
    status: "resolved",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    callId: "CG002",
    citizenMobile: "9876543211",
    citizenName: "Sunita Devi",
    queryType: "Income Certificate",
    satisfaction: "not-satisfied",
    description: "Citizen was not satisfied with the processing time. Income certificate application is taking longer than expected. Requires follow-up with district office.",
    submittedBy: "EXE002",
    submittedAt: new Date("2024-01-14T14:20:00Z"),
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    callId: "CG003",
    citizenMobile: "9876543212",
    citizenName: "Mohan Lal",
    queryType: "Caste Certificate",
    satisfaction: "satisfied",
    description: "Query resolved successfully. Citizen was guided through the online application process and received immediate confirmation.",
    submittedBy: "EXE001",
    submittedAt: new Date("2024-01-13T16:45:00Z"),
    status: "resolved",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create default admin user in adminC collection (for admin login)
print('Creating default admin user...');
try {
  db.adminC.insertOne({
    username: "admin",
    password: "admin1234"
  });
  print('Default admin user created successfully');
} catch (e) {
  print('Admin user already exists or error: ' + e);
}

// Insert sample system users in users collection
print('Creating sample system users...');
try {
  db.users.insertMany([
    {
      username: "manager1",
      password: "manager123",
      type: "manager",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: "Executive1",
      password: "exec123",
      type: "Executive",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: "Executive1",
      password: "op123",
      type: "Executive",
      active: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  print('Sample users created successfully');
} catch (e) {
  print('Error creating sample users: ' + e);
}

print('MongoDB initialization completed successfully!');
print('Database: cg_portal_feedback');
print('Collections created with schema validation:');
print('- feedbacks (with validation)');
print('- users (with validation)');
print('- adminC (for admin authentication)');
print('Sample data inserted: 3 feedbacks, 1 admin, 3 sample users');
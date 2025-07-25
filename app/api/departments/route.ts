import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
    try {
        const db = await getDb()
        const departments = await db.collection('departments').find({}).sort({ createdAt: -1 }).toArray()

        // Convert ObjectId to string for JSON serialization
        const serializedDepartments = departments.map(dept => ({
            ...dept,
            _id: dept._id.toString(),
            id: dept._id.toString()
        }))

        return NextResponse.json(serializedDepartments)
    } catch (error) {
        console.error('Error fetching departments:', error)
        return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { deptName, deptEmail, deptContactNo } = body

        // Define allowed department names
        const allowedDepartments = ['Health Department', 'Finance Department', 'Tax Department']

        // Validation
        if (!deptName || !deptEmail || !deptContactNo) {
            return NextResponse.json(
                { error: "Department name, email, and contact number are required" },
                { status: 400 }
            )
        }

        // Validate department name against allowed list
        if (!allowedDepartments.includes(deptName)) {
            return NextResponse.json(
                { error: `Department name must be one of: ${allowedDepartments.join(', ')}` },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(deptEmail)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            )
        }

        // Validate contact number (10 digits)
        const phoneRegex = /^[0-9]{10}$/
        if (!phoneRegex.test(deptContactNo)) {
            return NextResponse.json(
                { error: "Contact number must be exactly 10 digits" },
                { status: 400 }
            )
        }

        // Validate department name length
        if (deptName.length < 2 || deptName.length > 100) {
            return NextResponse.json(
                { error: "Department name must be between 2 and 100 characters" },
                { status: 400 }
            )
        }

        const db = await getDb()

        // Check if department name already exists
        const existingDeptName = await db.collection('departments').findOne({
            deptName: { $regex: new RegExp(`^${deptName}$`, 'i') }
        })
        if (existingDeptName) {
            return NextResponse.json(
                { error: "Department name already exists" },
                { status: 400 }
            )
        }

        // Check if email already exists
        const existingEmail = await db.collection('departments').findOne({
            deptEmail: { $regex: new RegExp(`^${deptEmail}$`, 'i') }
        })
        if (existingEmail) {
            return NextResponse.json(
                { error: "Department email already exists" },
                { status: 400 }
            )
        }

        // Create new department
        const newDepartment = {
            deptName: deptName.trim(),
            deptEmail: deptEmail.trim().toLowerCase(),
            deptContactNo: deptContactNo.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await db.collection('departments').insertOne(newDepartment)

        const createdDepartment = {
            ...newDepartment,
            _id: result.insertedId.toString(),
            id: result.insertedId.toString()
        }

        return NextResponse.json({
            success: true,
            message: "Department created successfully",
            department: createdDepartment
        })
    } catch (error) {
        console.error('Error creating department:', error)
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }
        return NextResponse.json({ error: "Failed to create department" }, { status: 500 })
    }
}

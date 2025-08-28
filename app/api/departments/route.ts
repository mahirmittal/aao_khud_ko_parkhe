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
        const { name, description } = body

        // Validation
        if (!name || !description) {
            return NextResponse.json(
                { error: "Department name and description are required" },
                { status: 400 }
            )
        }

        // Validate department name length
        if (name.length < 2 || name.length > 100) {
            return NextResponse.json(
                { error: "Department name must be between 2 and 100 characters" },
                { status: 400 }
            )
        }

        // Validate description length
        if (description.length < 5 || description.length > 500) {
            return NextResponse.json(
                { error: "Department description must be between 5 and 500 characters" },
                { status: 400 }
            )
        }

        const db = await getDb()

        // Check if department name already exists
        const existingDept = await db.collection('departments').findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        })
        if (existingDept) {
            return NextResponse.json(
                { error: "Department name already exists" },
                { status: 400 }
            )
        }

        // Create new department
        const newDepartment = {
            name: name.trim(),
            description: description.trim(),
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

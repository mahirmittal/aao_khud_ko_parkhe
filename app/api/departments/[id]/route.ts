import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
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

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid department ID" }, { status: 400 })
        }

        const db = await getDb()

        // Check if department name already exists (excluding current department)
        const existingDept = await db.collection('departments').findOne({
            _id: { $ne: new ObjectId(id) },
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        })
        if (existingDept) {
            return NextResponse.json(
                { error: "Department name already exists" },
                { status: 400 }
            )
        }

        // Update the department
        const updatedDepartment = {
            name: name.trim(),
            description: description.trim(),
            updatedAt: new Date()
        }

        const result = await db.collection('departments').updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedDepartment }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Department not found" }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Department updated successfully"
        })
    } catch (error) {
        console.error('Error updating department:', error)
        return NextResponse.json({ error: "Failed to update department" }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid department ID" }, { status: 400 })
        }

        const db = await getDb()

        const result = await db.collection('departments').findOneAndDelete({
            _id: new ObjectId(id)
        })

        if (!result) {
            return NextResponse.json({ error: "Department not found" }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Department deleted successfully"
        })
    } catch (error) {
        console.error('Error deleting department:', error)
        return NextResponse.json({ error: "Failed to delete department" }, { status: 500 })
    }
}

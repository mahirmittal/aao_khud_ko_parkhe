import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
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

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid department ID" }, { status: 400 })
        }

        const db = await getDb()

        // Check if department name already exists (excluding current department)
        const existingDeptName = await db.collection('departments').findOne({
            _id: { $ne: new ObjectId(id) },
            deptName: { $regex: new RegExp(`^${deptName}$`, 'i') }
        })
        if (existingDeptName) {
            return NextResponse.json(
                { error: "Department name already exists" },
                { status: 400 }
            )
        }

        // Check if email already exists (excluding current department)
        const existingEmail = await db.collection('departments').findOne({
            _id: { $ne: new ObjectId(id) },
            deptEmail: { $regex: new RegExp(`^${deptEmail}$`, 'i') }
        })
        if (existingEmail) {
            return NextResponse.json(
                { error: "Department email already exists" },
                { status: 400 }
            )
        }

        const result = await db.collection('departments').findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    deptName: deptName.trim(),
                    deptEmail: deptEmail.trim().toLowerCase(),
                    deptContactNo: deptContactNo.trim(),
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        )

        if (!result) {
            return NextResponse.json({ error: "Department not found" }, { status: 404 })
        }

        const updatedDepartment = {
            ...result,
            _id: result._id.toString(),
            id: result._id.toString()
        }

        return NextResponse.json({
            success: true,
            message: "Department updated successfully",
            department: updatedDepartment
        })
    } catch (error) {
        console.error('Error updating department:', error)
        return NextResponse.json({ error: "Failed to update department" }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

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

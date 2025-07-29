import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const db = await getDb()
    
    // Try to find user in multiple collections with proper schema
    let admin = await db.collection('users').findOne({ 
      username: username,
      type: { $in: ['admin', 'executive'] },
      active: true
    })
    
    if (!admin) {
      admin = await db.collection('adminC').findOne({ username })
    }

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check password (plain text comparison as stored in MongoDB)
    if (admin.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Authentication successful
    return NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        user: {
          username: admin.username,
          id: admin._id,
          type: admin.type || 'admin',
          active: admin.active
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

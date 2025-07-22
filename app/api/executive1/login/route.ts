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
    const usersCollection = db.collection('users')

    // Find user by username from the users collection
    const user = await usersCollection.findOne({
      username,
      type: 'executive'  // Only allow executive type users
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user is active (if active field exists)
    if (user.active === false) {
      return NextResponse.json(
        { error: 'Account is inactive. Please contact administrator.' },
        { status: 401 }
      )
    }

    // Check password (plain text comparison as stored in MongoDB)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Executive type check already done in the query above

    // Authentication successful
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          username: user.username,
          type: user.type,
          id: user._id,
          active: user.active
        }
      },
      { status: 200 }
    )
    console.log("Login successful")

  } catch (error) {
    console.error('Executive login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

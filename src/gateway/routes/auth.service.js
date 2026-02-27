import bcrypt from 'bcrypt';
import pool from '../db';

export async function createAdminService(email,password) {
    
    const existing = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    )
    if (existing.rows.legth > 0){
        throw new Error ('El usuario ya existe')
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const result = await pool.query(
         'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
         [email,hashedPassword,'ADMIN']
    )
    return result.row[0]
    
}

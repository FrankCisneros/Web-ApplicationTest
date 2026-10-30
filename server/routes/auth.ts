import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../data/users';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('Falta JWT_SECRET en las variables de entorno');
}

const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'];

function signToken(user: { id: string; name: string; email: string }) {
    return jwt.sign(
        { sub: user.id, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
    );
}

router.post('/register', async (req, res) => {
    const { name, email, password, repassword } = req.body as {
        name?: string;
        email?: string;
        password?: string;
        repassword?: string;
    }

    if  (password != repassword){
        res.status(400).json({ message: 'Las contraseñas no coinciden' });
        return;
    }

    if (!name || !email || !password || !repassword) {
        res.status(400).json({ message: 'Todos los campos son obligatorios' });
        return;
    }

    const user = findUserByEmail(email);

    if (user) {
        res.status(400).json({ message: 'El usuario ya esta registrado, por favor ingrese con su cuenta' });
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = createUser({ name, email, passwordHash });

    res.status(201).json({
        message: 'Usuario registrado correctamente',
        token: signToken(newUser),
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        },
    });
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body as {
        email?: string;
        password?: string;
    };

    if (!email || !password) {
        res.status(400).json({ message: 'Email y contraseña son obligatorios' });
        return;
    }

    const user = findUserByEmail(email);

    if (!user) {
        res.status(401).json({ message: 'Credenciales inválidas' });
        return;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
        res.status(401).json({ message: 'Credenciales inválidas' });
        return;
    }

    const token = signToken(user);

    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    });
});

export default router;

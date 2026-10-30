import { Router, type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import {
    deleteMarker,
    getMarkerById,
    getMarkers,
    isValidColor,
    saveMarker,
    updateMarker,
    type MarkerChanges,
} from '../data/markers';

const router = Router();

const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error('Falta JWT_SECRET en las variables de entorno');
}

const JWT_SECRET: string = secret;

const HEX_COLOR_MESSAGE = 'El color debe estar en formato hexadecimal, por ejemplo #1f2937';

function readMarkerId(req: Request): string {
    const id = req.params.id;
    return Array.isArray(id) ? id[0] ?? '' : id;
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return;
    }

    const token = header.slice('Bearer '.length).trim();

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        if (typeof payload === 'string' || typeof payload.sub !== 'string') {
            res.status(401).json({ message: 'Token inválido' });
            return;
        }

        res.locals.userId = payload.sub;
        next();
    } catch {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function isCoordinate(value: unknown, min: number, max: number): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

// GET /api/markers
router.get('/', requireAuth, (req, res) => {
    const userId = res.locals.userId as string;

    res.json({ markers: getMarkers(userId) });
});

// GET /api/markers/:id
router.get('/:id', requireAuth, (req, res) => {
    const userId = res.locals.userId as string;

    const marker = getMarkerById(readMarkerId(req), userId);

    if (!marker) {
        res.status(404).json({ message: 'Marcador no encontrado' });
        return;
    }

    res.json({ marker });
});

// POST /api/markers
router.post('/', requireAuth, async (req, res) => {
    const userId = res.locals.userId as string;
    const body = (req.body ?? {}) as Record<string, unknown>;

    const { title, description, latitude, longitude, color } = body;

    if (!isNonEmptyString(title)) {
        res.status(400).json({ message: 'El título es obligatorio' });
        return;
    }

    if (typeof description !== 'string') {
        res.status(400).json({ message: 'La descripción es obligatoria' });
        return;
    }

    if (!isCoordinate(latitude, -90, 90)) {
        res.status(400).json({ message: 'La latitud debe ser un número entre -90 y 90' });
        return;
    }

    if (!isCoordinate(longitude, -180, 180)) {
        res.status(400).json({ message: 'La longitud debe ser un número entre -180 y 180' });
        return;
    }

    if (typeof color !== 'string' || !isValidColor(color)) {
        res.status(400).json({ message: HEX_COLOR_MESSAGE });
        return;
    }

    const marker = await saveMarker({
        title,
        description,
        latitude,
        longitude,
        color,
        user_id: userId,
    });

    res.status(201).json({
        message: 'Marcador creado correctamente',
        marker,
    });
});

// PUT /api/markers/:id y PATCH /api/markers/:id
async function handleUpdate(req: Request, res: Response) {
    const userId = res.locals.userId as string;
    const body = (req.body ?? {}) as Record<string, unknown>;

    const changes: MarkerChanges = {};

    if (body.title !== undefined) {
        if (!isNonEmptyString(body.title)) {
            res.status(400).json({ message: 'El título no puede estar vacío' });
            return;
        }
        changes.title = body.title;
    }

    if (body.description !== undefined) {
        if (typeof body.description !== 'string') {
            res.status(400).json({ message: 'La descripción debe ser un texto' });
            return;
        }
        changes.description = body.description;
    }

    if (body.latitude !== undefined) {
        if (!isCoordinate(body.latitude, -90, 90)) {
            res.status(400).json({ message: 'La latitud debe ser un número entre -90 y 90' });
            return;
        }
        changes.latitude = body.latitude;
    }

    if (body.longitude !== undefined) {
        if (!isCoordinate(body.longitude, -180, 180)) {
            res.status(400).json({ message: 'La longitud debe ser un número entre -180 y 180' });
            return;
        }
        changes.longitude = body.longitude;
    }

    if (body.color !== undefined) {
        if (typeof body.color !== 'string' || !isValidColor(body.color)) {
            res.status(400).json({ message: HEX_COLOR_MESSAGE });
            return;
        }
        changes.color = body.color;
    }

    if (Object.keys(changes).length === 0) {
        res.status(400).json({ message: 'No se enviaron campos para actualizar' });
        return;
    }

    const marker = await updateMarker(readMarkerId(req), userId, changes);

    if (!marker) {
        res.status(404).json({ message: 'Marcador no encontrado' });
        return;
    }

    res.json({
        message: 'Marcador actualizado correctamente',
        marker,
    });
}

router.put('/:id', requireAuth, handleUpdate);
router.patch('/:id', requireAuth, handleUpdate);

// DELETE /api/markers/:id
router.delete('/:id', requireAuth, async (req, res) => {
    const userId = res.locals.userId as string;

    const deleted = await deleteMarker(readMarkerId(req), userId);

    if (!deleted) {
        res.status(404).json({ message: 'Marcador no encontrado' });
        return;
    }

    res.json({ message: 'Marcador eliminado correctamente' });
});

export default router;

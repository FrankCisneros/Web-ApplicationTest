import { randomUUID } from "crypto"

export interface MapMarker {
    id: string
    title: string
    description: string
    latitude: number
    longitude: number
    color: string
    user_id: string
}

const HEX_COLOR = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export interface MarkerChanges {
    title?: string
    description?: string
    latitude?: number
    longitude?: number
    color?: string
}

const MapMarkers: MapMarker[] = []

export function isValidColor(color: string): boolean {
    return HEX_COLOR.test(color);
}

function findIndexById(id: string, user_id: string): number {
    return MapMarkers.findIndex(marker => marker.id === id && marker.user_id === user_id);
}

export function getMarkers(user_id: string): MapMarker[] {
    return MapMarkers.filter(marker => marker.user_id === user_id);
}

export function getMarkerById(id: string, user_id: string): MapMarker | undefined {
    return MapMarkers.find(marker => marker.id === id && marker.user_id === user_id);
}

export async function saveMarker(
    data: {title: string, 
        description: string, 
        latitude: number, 
        longitude: number,
        color: string,
        user_id: string 
    }):Promise<MapMarker>  {
    
    if (!isValidColor(data.color)){
        throw new Error("Color no valido")
    }
    
    const newMarker: MapMarker = {
        id: randomUUID(),
        title: data.title,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        color: data.color,
        user_id: data.user_id
    };

    MapMarkers.push(newMarker);

    return newMarker;
}

export async function updateMarker(
    id: string,
    user_id: string,
    changes: MarkerChanges
): Promise<MapMarker | undefined> {

    const index = findIndexById(id, user_id);

    if (index === -1) {
        return undefined;
    }

    if (changes.color !== undefined && !isValidColor(changes.color)) {
        throw new Error("Color no valido")
    }

    const current = MapMarkers[index];

    const updatedMarker: MapMarker = {
        ...current,
        title: changes.title ?? current.title,
        description: changes.description ?? current.description,
        latitude: changes.latitude ?? current.latitude,
        longitude: changes.longitude ?? current.longitude,
        color: changes.color ?? current.color
    };

    MapMarkers[index] = updatedMarker;

    return updatedMarker;
}

export async function deleteMarker(id: string, user_id: string): Promise<boolean> {

    const index = findIndexById(id, user_id);

    if (index === -1) {
        return false;
    }

    MapMarkers.splice(index, 1);

    return true;
}
import { Significado } from './significado';

export interface Palabra {
    significado: Significado;
    nombre: string;
    estado: number;
}

import { Etiqueta } from "./etiqueta";

export interface Video {
    id: number;
    likes: number;
    dislikes: number;
    descripcion: string;
    etiquetas: Etiqueta[];
    authorName: string;
    isInDictionary: boolean;
    didIlikeIt:boolean;
    didIDislikeIt:boolean;
    url: string;
    nombre: string;
    embedUrl: any;
    comentario: string;
}

import { Video } from "./video";

export interface Significado {
    descripcion: string;
    etiquetas: string[];
    videos: string[];
    highest_voted_video: Video;
}

export interface Video {
    id: number;
    likes: number;
    dislikes: number;
    descripcion: string;
    etiquetas: string[];
    authorName: string;
    isInDictionary: boolean;
    didIlikeIt:boolean;
    didIDislikeIt:boolean;
    url: string;
    embedUrl: any;
}

export type FileType = 'image' | 'document' | 'folder';

export interface File {
    id: string;
    name: string;
    type: FileType;
    path: string;
}

export interface Folder {
    id: string;
    name: string;
    files: File[];
    subFolders: Folder[];
}
export interface TypeActivity {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTypeActivityDTO {
    name: string;
    description?: string;
}

export interface UpdateTypeActivityDTO {
    name?: string;
    description?: string;
}
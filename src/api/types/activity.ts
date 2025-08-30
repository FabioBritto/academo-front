export interface Activity {
    id: number;
    date: Date;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateActivityDTO {
    date: Date;
    name: string;
    description?: string;
}

export interface UpdateActivityDTO {
    date?: Date;
    name?: string;
    description?: string;
}
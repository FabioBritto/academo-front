export interface Subject {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateSubjectDTO {
    name: string;
    description?: string;
}

export interface UpdateSubjectDTO {
    name?: string;
    description?: string;
    isActive?: boolean;
}
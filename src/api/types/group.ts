export interface Group {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateGroupDTO {
    name: string;
    description?: string;
}

export interface UpdateGroupDTO {
    name?: string;
    description?: string;
    isActive?: boolean;
}
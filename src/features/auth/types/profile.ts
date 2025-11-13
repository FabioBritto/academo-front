export interface Profile {
    id: number;
    fullName: string;
    birthDate: Date;
    gender: string;
    institution: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProfileDTO {
    fullName: string;
    birthDate?: Date;
    gender?: string;
    institution: string;
}

export interface UpdateProfileDTO {
    fullName?: string;
    birthDate?: Date;
    gender?: string;
    institution?: string;
}
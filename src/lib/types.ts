export type User = {
    id: string;
    _id?: string;
    name: string;
    email: string;
    isAdmin?: boolean;
    role?: 'voter' | 'admin';
};

export type Candidate = {
    id?: string;
    _id?: string;
    name: string;
    position: string;
    photo: string;
    votes: number;
};

export type Election = {
    id?: string;
    _id?: string;
    title: string;
    description: string;
    category: string;
    department?: string;
    faculty?: string;
    isOpen: boolean;
    candidates: Candidate[];
};

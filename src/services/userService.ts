import User, { IUser } from '../models/User';

export const getAllUsers = async (): Promise<IUser[]> => {
    return User.find();
};

export const getUserById = async (id: string): Promise<IUser | null> => {
    return User.findById(id);
};

export const updateUser = async (id: string, updates: Partial<IUser>): Promise<IUser | null> => {
    return User.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
    return User.findByIdAndDelete(id);
};
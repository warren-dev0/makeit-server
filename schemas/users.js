import z from 'zod';

const userSchema = z.object({
    avatar: z.string().url(),
    email: z.string().email().includes('@').min(5).max(255),
    name: z.string(),
    password: z.string().min(8).max(255),
    firstQuestion: z.string(),
    firstAnswer: z.string(),
    secondQuestion: z.string(),
    secondAnswer: z.string(),
    thirdQuestion: z.string(),
    thirdAnswer: z.string(),
});

export function validateUser(object) {
    return userSchema.safeParse(object);
}

export function validatePartialUser(object) {
    return userSchema.partial().safeParse(object);
}
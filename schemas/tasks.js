import z from 'zod';

const taskSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required.'
    }),
    dueDate: z.string().optional(),
    description: z.string().optional(),
    myday: z.number().int().min(0).max(1).default(0),
    groupId: z.number().int().positive().default(1),
    statusId: z.number().int().positive().default(1),
    userId: z.string(),
});

export function validateTask(object) {
    return taskSchema.safeParse(object);
}

export function validatePartialTask(object) {
    return taskSchema.partial().safeParse(object);
}
import z from 'zod';

const subTaskSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required.'
    })
});

export function validateSubTask(object) {
    return subTaskSchema.safeParse(object);
}
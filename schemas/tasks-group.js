import z from 'zod';

const taskGroupSchema = z.object({
    description: z.string({
        invalid_type_error: 'Group description must be a string',
        required_error: 'Group description is required.'
    })
});

export function validateTaskGroup(object) {
    return taskGroupSchema.safeParse(object);
}
import z from 'zod';

const taskGroupSchema = z.object({
    description: z.string({
        invalid_type_error: 'Group description must be a string',
        required_error: 'Group description is required.'
    }),
    color: z.string({
        invalid_type_error: 'Group color must be a string',
        required_error: 'Group color is required.'
    }),
    userId: z.string({
        invalid_type_error: 'User ID must be a string',
        required_error: 'User ID is required.'
    })
});

export function validateTaskGroup(object) {
    return taskGroupSchema.safeParse(object);
}
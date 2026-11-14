export const validateSchema = (schema, property = 'body') => (req, res, next) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
        const details = result.error.issues.map((issue) => ({
            field: issue.path.join('.') || property,
            message: issue.message
        }));

        return res.status(400).json({
            error: 'Error de validación en los datos enviados',
            details
        });
    }

   
    if (result.data !== undefined && property === 'body') {
        req.body = result.data;
    }

    next();
};
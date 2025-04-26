import { z } from "zod";

const updateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().email().optional(),
  }),
});

export const AdminValidationSchemas = {
  updateSchema,
};

import { z } from "zod";

const updateSchema = z.object({
  body: z.object({
   
  }),
});

export const AppointMentValidationSchemas = {
  updateSchema,
};

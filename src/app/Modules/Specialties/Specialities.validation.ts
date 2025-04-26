import { z } from "zod";

const createSpecialitySchema = z.object({
  title: z.string({
    required_error: "Title is required!",
  }),
});

export const SpecialtiesValidtaion = {
  createSpecialitySchema,
};

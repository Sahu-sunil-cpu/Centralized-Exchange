import { z } from "zod"


const addUser = "ADD_USER";

export type messageTypes = {
   type: typeof addUser,
   payload: addUserType,
}


const addUserSchema = z.object({
    tickerId: z.string(),
})

type addUserType = z.infer<typeof addUserSchema>;
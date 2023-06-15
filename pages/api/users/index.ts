import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";

import container from "@/server/container";

const router = createRouter<NextApiRequest, NextApiResponse>();


router
    .get(async (req, res) => {
        const users = await container.resolve("UserService").getUsers();
        // const users = await getUsers();

        res.json(users);
    })
    .post(async (req, res) => {
        const user = await container.resolve("UserService").createUser(req.body);
        res.json(user);
    })
    .delete(async (req, res) => {
        console.log("Req query--------------------\n", req.query)
        const user = await container.resolve("UserService").deleteUser(req.query.id);
        res.json({res: "User deleted"});
    });


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});


import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { id, firstName, lastName, email, password } = req.body;

  let response = await fetch("http://localhost:8000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: req.body,
  });

  let responseData = await response.json();

  console.log(responseData);

  // res.status(200).json({ response: responseData });
  // return responseData as response, it is of type string
  res.status(200).json({ response: responseData });
}

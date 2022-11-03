import type { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from "iron-session/next";

type ResponseData = {
  error?: string
}

declare module "iron-session" {
  interface IronSessionData {
    locktreeSessionToken?: string;
  }
}

export default withIronSessionApiRoute(
  async function handler(req, res) {
    const { key = "" } = req.query
    if (key === "") {
      return res.status(404).json({ error: 'Missing path parameter: [key]' })
    }
    const profileID = "" //Lookup ID by key
    const redirectTo = `/profile/${profileID}`

    req.session.locktreeSessionToken = "" //generate TTL session token
    await req.session.save();

    res.writeHead(302, {
      'Location': redirectTo
    }).end()
  },
  {
    cookieName: "locktree_unlocked",
    password: "complex_password_at_least_32_characters_long",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
)
import type { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from "iron-session/next";

type ResponseData = {
  error?: string
}

type AnabaSession = {
  initializedAt: EpochTimeStamp
}

declare module "iron-session" {
  interface IronSessionData {
    anabaSession: AnabaSession;
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

    req.session.anabaSession = {
      initializedAt: Date.now()
    } 
    //generate TTL session token
    await req.session.save();

    res.writeHead(302, {
      'Location': redirectTo
    }).end()
  },
  {
    cookieName: "anaba_unlocked",
    password: "complex_password_at_least_32_characters_long",
    cookieOptions: {
      // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400,
    },
  }
)
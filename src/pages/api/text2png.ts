import type { NextApiRequest, NextApiResponse } from 'next'
import createPlugin from '@extism/extism'
 
type ResponseData = {
  message: string
}
 
const plugin = await createPlugin(
  "https://cdn.modsurfer.dylibso.com/api/v1/module/d7c54420f559239689b0b3df41ab8a692d7450120397190cb1167dc05008f633.wasm",
  { useWasi: false },
);


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const text = url.searchParams.get("text") || ""
  const color = url.searchParams.get("color") || ""
  const fontSize = parseInt(url.searchParams.get("font_size") || "44")
  
 
  const out = await plugin.call("image", JSON.stringify({ value: text, color, font_size: fontSize}))
  
  if (out) {
    res.status(200).setHeader("content-type", "image/png").write(out.bytes())
  }

  else {
    res.status(500)
  }

  res.end()
}

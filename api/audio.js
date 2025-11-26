module.exports = async function(req, res) {
  try {
    const label = (req.query.label || "").toString()
    if (!label) {
      res.status(400).send("label required")
      return
    }
    const norm = label.replace(/ü/g, "v")
    const url = `http://du.hanyupinyin.cn/du/pinyin/${norm}.mp3`
    const resp = await fetch(url)
    if (!resp.ok) {
      res.status(resp.status).send("")
      return
    }
    const ab = await resp.arrayBuffer()
    res.setHeader("Content-Type", "audio/mpeg")
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
    res.send(Buffer.from(ab))
  } catch (e) {
    res.status(500).send("")
  }
}

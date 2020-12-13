const express = require("express")
const app = express()
const PORT = 3000
const Discord = require("discord.js")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/send", async (req, res) => {
    const WebhookURL = req.body.url
    const split = WebhookURL.split("/")
    const id = split[5]
    const token = split[6]
    if(id == '' || !id || token == '' || !token) return res.json({ status: "error", reason: 'Invalid Webhook'})
    let webhook = new Discord.WebhookClient(id, token)
    if(!webhook) return res.json({ status: "error", reason: 'Invalid Webhook'})
    const embed = new Discord.MessageEmbed()
        .setDescription(req.body.description)
    if(req.body.title) embed.setTitle(req.body.title)
    let url;
    if(req.body.authorUrl) {
        url = req.body.authorUrl
    }
    if(req.body.authorName) embed.setAuthor(req.body.authorName, url)
    embed.setColor(req.body.color)
    if(req.body.banner.toString() == 'true') {
        embed.setImage(req.body.image)
    } else {
        embed.setThumbnail(req.body.image)
    }
    try {
        await webhook.send(embed)
    } catch {
        return res.json({ status: "error", reason: 'Invalid Webhook'})
    }
    webhook.destroy()
    res.json({ status: "ok" })
})

app.listen(PORT, () => {
    console.log("Listening for requests on port " + PORT)
})
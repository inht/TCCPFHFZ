// ╔╦╗╔═╗╔═╗╔═╗╔═╗╦ ╦╔═╗╔═╗
//  ║ ║  ║  ╠═╝╠╣ ╠═╣╠╣ ╔═╝
//  ╩ ╚═╝╚═╝╩  ╚  ╩ ╩╚  ╚═╝

// Import Packages
require("colors")
const fs = require("fs")
const yml = require("yaml")
const mf_client = require('mineflayer')

const rpc = require('discord-rich-presence')('<Discord App ID Here>')
// ===========================
console.log(" ╔╦╗╔═╗╔═╗╔═╗╔═╗╦ ╦╔═╗╔═╗\n".blue +
    "  ║ ║  ║  ╠═╝╠╣ ╠═╣╠╣ ╔═╝\n".blue +
    "  ╩ ╚═╝╚═╝╩  ╚  ╩ ╩╚  ╚═╝".blue)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// [Load Configuration]
const config_file_parsing = fs.readFileSync("./[config]/config.yml", "utf-8") // Read Configuration File
const config_file_parsed = yml.parse(config_file_parsing) // Parse YML file into readable format.

// [Load Accounts]
let acc = []
const accounts = fs.readFileSync("./[data]/accounts.txt", "utf-8")
acc.push(accounts.split("\r\n"))
let acc_data = acc[0]
console.log("Loaded " + `${acc_data.length}`.yellow + " minecraft accounts.")

// [Discord Presence]
if (config_file_parsed['discord_presence'] === true) {

    rpc.updatePresence({
        state: `Attempting ${acc[0].length} account(s).`,
        details: 'Queuing Hypixel',
        startTimestamp: Date.now(),
        largeImageKey: 'main',
        instance: true
    });

    console.log("Discord Presence:" + " Enabled".green)
} else {
    console.log("Discord Presence:" + " Disabled".red)
}

if (config_file_parsed['mojang_auth'] === true) {
    console.log("Mojang Authentication:" + " Enabled".green)
    console.log("Microsoft Authentication:" + " Disabled".red)
} else {
    console.log("Mojang Authentication:" + " Disabled".red)
    console.log("Microsoft Authentication:" + " Disabled".green)
}

let authtype = {
    true: "mojang",
    false: "microsoft"
}

// Seperate Email:Pass
let seperated_user_pass = []
for (let i = 0; i < acc_data.length; i++) {
    let seperate_user_pass = acc_data[i].split(":");
    seperated_user_pass.push(seperate_user_pass)
}

async function loginUser() {
    for (let i = 0; i < acc_data.length; i++) {
        const user = mf_client.createBot({
            username: seperated_user_pass[i][0],
            password: seperated_user_pass[i][1],
            host: 'TCCPFHFZ.hypixel.net',
            port: 25565,
            auth: authtype[config_file_parsed['mojang_auth']],
            version: '1.8.9'
        })

        user.on('spawn', () => {
            console.log(`[CLIENT/${i + 1}] ${seperated_user_pass[i][2]} has connected successfully to a lobby.`.green)
        })

        user.on('error', () => {
            console.log(`[CLIENT/${i + 1}] ${seperated_user_pass[i][2]} has encountered an error.`.red)
        })
        await sleep(3000)
    }
}

loginUser().then(() => console.log("Finished attempts."))

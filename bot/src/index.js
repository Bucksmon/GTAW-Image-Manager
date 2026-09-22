import "dotenv/config";
import { Client, Events, GatewayIntentBits, Partials, REST, Routes, SlashCommandBuilder } from "discord.js";

const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID = "", API_URL, BOT_API_KEY, MAX_UPLOAD_MB = "4" } = process.env;

for (const [name, value] of Object.entries({ DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, API_URL, BOT_API_KEY })) {
  if (!value) { console.error(name + " is not configured."); process.exit(1); }
}

const apiBase = API_URL.replace(/\/$/, "");
const maxUploadBytes = Number(MAX_UPLOAD_MB) * 1024 * 1024;
const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel]
});

const commands = [
  new SlashCommandBuilder().setName("upload").setDescription("Upload a GTAW screenshot.").addAttachmentOption(option => option.setName("image").setDescription("PNG, JPEG, WebP, or GIF.").setRequired(true)).setDMPermission(true),
  new SlashCommandBuilder().setName("help").setDescription("Show how to use GTAW Image Manager.").setDMPermission(true)
].map(command => command.toJSON());

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);
  const route = DISCORD_GUILD_ID ? Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID) : Routes.applicationCommands(DISCORD_CLIENT_ID);
  await rest.put(route, { body: commands });
  console.log(DISCORD_GUILD_ID ? "Registered guild commands." : "Registered global commands.");
}

function mimeType(attachment) {
  if (allowedTypes.has(attachment.contentType)) return attachment.contentType;
  const ext = attachment.name?.split(".").pop()?.toLowerCase();
  return ({ png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif" })[ext] || null;
}

async function upload(attachment, userId) {
  const type = mimeType(attachment);
  if (!type) throw new Error("Only PNG, JPEG, WebP, and GIF images are supported.");
  if (attachment.size > maxUploadBytes) throw new Error("Image exceeds the " + MAX_UPLOAD_MB + " MB limit.");
  const fileResponse = await fetch(attachment.url, { signal: AbortSignal.timeout(30000) });
  if (!fileResponse.ok) throw new Error("Discord could not provide the image.");
  const buffer = await fileResponse.arrayBuffer();
  if (buffer.byteLength > maxUploadBytes) throw new Error("Image exceeds the " + MAX_UPLOAD_MB + " MB limit.");
  const form = new FormData();
  form.append("image", new Blob([buffer], { type }), attachment.name || "screenshot");
  form.append("discordUserId", userId);
  const response = await fetch(apiBase + "/api/bot/images/upload", { method: "POST", headers: { Authorization: "Bearer " + BOT_API_KEY }, body: form, signal: AbortSignal.timeout(60000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Image upload failed.");
  return data;
}

function resultText(data) {
  const hosts = (data.item?.hosts || []).filter(host => host.status === "active" && host.url);
  if (!hosts.length) return "❌ Upload completed but no image host returned a URL.";
  const primary = hosts[0].url;
  const filename = data.item?.filename || "screenshot";
  const lines = ["## Upload complete", "", ...hosts.map(host => "**" + host.provider + ":** <" + host.url + ">"), "", "**BBCode**", "[img]" + primary + "[/img]", "", "**Markdown**", "![" + filename + "](" + primary + ")"];
  if (data.providerWarnings?.length) lines.push("", "⚠️ " + data.providerWarnings.join(" | "));
  return lines.join("\n");
}

async function handle(target, attachment) {
  const userId = target.user?.id || target.author?.id;
  if (!userId) throw new Error("Could not determine your Discord ID.");
  const data = await upload(attachment, userId);
  const content = resultText(data);
  if (target.isChatInputCommand?.()) return target.editReply({ content });
  return target.reply({ content });
}

client.once(Events.ClientReady, async ready => {
  console.log("Logged in as " + ready.user.tag);
  try { await registerCommands(); } catch (error) { console.error("Command registration failed:", error); }
});

client.on(Events.MessageCreate, async message => {
  if (message.author.bot || message.guildId || message.attachments.size === 0) return;
  const attachment = message.attachments.find(item => Boolean(mimeType(item)));
  if (!attachment) return message.reply("❌ Please send a PNG, JPEG, WebP, or GIF image.");
  try { await handle(message, attachment); } catch (error) { await message.reply("❌ " + (error instanceof Error ? error.message : "Upload failed.")); }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "help") return interaction.reply("📷 DM me an image for automatic upload. In servers, use /upload with an image.");
  if (interaction.commandName === "upload") {
    const attachment = interaction.options.getAttachment("image", true);
    await interaction.deferReply();
    try { await handle(interaction, attachment); } catch (error) { await interaction.editReply("❌ " + (error instanceof Error ? error.message : "Upload failed.")); }
  }
});

client.login(DISCORD_BOT_TOKEN);
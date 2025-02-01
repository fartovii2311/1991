import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import https from 'https';
import stream from 'stream';

// Función para obtener el token y las cookies
async function getTokenAndCookies() {
    try {
        const response = await axios.get('https://dlpanda.com/es/facebook', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                'Referer': 'https://dlpanda.com/es/facebook',
                'Accept-Language': 'es-ES,es;q=0.9',
                'Connection': 'keep-alive'
            }
        });

        const $ = cheerio.load(response.data);
        const token = $('input[name="_token"]').attr('value');
        const cookies = response.headers['set-cookie'];

        if (!token) {
            return null;
        }

        return { token, cookies };

    } catch (error) {
        console.error("❌ Error al obtener el token:", error.message);
        return null;
    }
}

// Función para obtener el enlace de descarga de Facebook
async function dlfacebook(videoUrl) {
    try {
        const tokenData = await getTokenAndCookies();
        if (!tokenData) return { success: false, error: "No se pudo obtener el token" };

        const { token, cookies } = tokenData;
        const postData = `url=${encodeURIComponent(videoUrl)}&_token=${token}`;

        const response = await axios.post(
            'https://dlpanda.com/es/facebook',
            postData,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://dlpanda.com/es/facebook',
                    'Accept-Language': 'es-ES,es;q=0.9',
                    'Connection': 'keep-alive',
                    'Cookie': cookies ? cookies.join('; ') : ''
                }
            }
        );

        const $ = cheerio.load(response.data);
        const downloadLink = $('a#download-video-btn').attr('href');

        if (!downloadLink) {
            console.error("❌ No se encontró el enlace de descarga.");
            console.error("🔎 HTML recibido:", response.data);
            return { success: false, error: "No se encontró el enlace de descarga." };
        }

        return { success: true, downloadLink };

    } catch (error) {
        console.error("❌ Error:", error.message);
        return { success: false, error: error.message };
    }
}

// Función para descargar y enviar el video
async function downloadAndSendVideo(m, videoUrl) {
    try {
        const result = await dlfacebook(videoUrl);

        if (result.success) {
            const videoDownloadUrl = result.downloadLink;
            const fileName = path.basename(videoDownloadUrl);

            console.log("🔍 Iniciando la descarga del video...");

            const fileStream = fs.createWriteStream(fileName);

            https.get(videoDownloadUrl, (response) => {
                response.pipe(fileStream);
                fileStream.on('finish', async () => {
                    console.log("✅ Descarga completada.");

                    fileStream.close();

                    await m.reply({
                        video: fs.createReadStream(fileName),
                        caption: 'Aquí tienes tu video de Facebook',
                    });
                    fs.unlinkSync(fileName);
                });
            }).on('error', (err) => {
                console.error("❌ Error al descargar el video:", err.message);
                m.reply('❌ No se pudo descargar el video.');
            });
        } else {
            m.reply(`❌ Error: ${result.error}`);
        }

    } catch (error) {
        console.error("❌ Error al procesar la solicitud:", error);
        m.reply('❌ Algo salió mal al procesar la solicitud.');
    }
}

// Handler para procesar comandos de descarga de video
let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        // Verificar si se proporcionó una URL
        if (!text) {
            await m.reply('⚠️ Por favor, proporciona una URL de Facebook.');
            return;
        }

        await m.react('✅');  // Confirmación de que el bot está procesando la solicitud

        await downloadAndSendVideo(m, text);

    } catch (error) {
        console.error(error);
        await m.react('✖');  // Reacción de error
        await m.reply('❌ Algo salió mal al procesar la solicitud.');
    }
};

handler.command = ['fb2']; // Comando para activar la función

export default handler;

let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'));
let chalk = (await import('chalk')).default;

let handler = async (m, { conn }) => {
    if (!m.quoted) {
        return conn.reply(
            m.chat, 
            `🚩 Responde a una imagen, video o audio ViewOnce.`, 
            m
        );
    }

    if (m.quoted.mtype !== 'viewOnceMessageV2') {
        return conn.reply(
            m.chat, 
            `🚩 Responde a una imagen, video o audio ViewOnce.`, 
            m
        );
    }

    try {
        let msg = m.quoted.message;
        let type = Object.keys(msg)[0];

        if (!['imageMessage', 'videoMessage', 'audioMessage'].includes(type)) {
            return conn.reply(
                m.chat, 
                `🚩 Tipo de archivo no soportado.`, 
                m
            );
        }

        let media = await downloadContentFromMessage(
            msg[type],
            type === 'imageMessage' ? 'image' :
            type === 'videoMessage' ? 'video' :
            'audio'
        );

        let buffer = Buffer.from([]);
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        if (!buffer || buffer.length === 0) {
            return conn.reply(
                m.chat, 
                `🚩 No se pudo descargar el contenido.`, 
                m
            );
        }
        
        if (type === 'videoMessage') {
            return conn.sendMessage(
                m.chat, 
                { 
                    video: buffer, 
                    mimetype: 'video/mp4', 
                    caption: msg[type]?.caption || '' 
                }, 
                { quoted: m }
            );
        } else if (type === 'imageMessage') {
            return conn.sendMessage(
                m.chat, 
                { 
                    image: buffer, 
                    caption: msg[type]?.caption || '' 
                }, 
                { quoted: m }
            );
        } else if (type === 'audioMessage') {
            return conn.sendMessage(
                m.chat, 
                { 
                    audio: buffer, 
                    mimetype: 'audio/mpeg' 
                }, 
                { quoted: m }
            );
        } else {
            return conn.reply(
                m.chat, 
                `🚩 Tipo de archivo no soportado.`, 
                m
            );
        }
    } catch (error) {
        console.error("Error al procesar el mensaje ViewOnce:", error);
        return conn.reply(
            m.chat, 
            `🚩 Error al procesar el mensaje ViewOnce: ${error.message}`, 
            m
        );
    }
};

handler.help = ['ver'];
handler.tags = ['tools'];
handler.command = ['readviewonce', 'read', 'ver', 'readvo']; 
handler.register = true;

export default handler;

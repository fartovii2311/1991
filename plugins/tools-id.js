const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    await conn.sendMessage(m.chat, { 
      text: `Uso: ${usedPrefix}${command} <link del grupo/canal>` 
    });
    return;
  }

  const link = args[0];
  const regexGroup = /https:\/\/chat\.whatsapp\.com\/([\w\d]+)/;
  const regexChannel = /https:\/\/whatsapp\.com\/channel\/([\w\d]+)/;

  let id;

  if (regexGroup.test(link)) {
    const match = link.match(regexGroup);
    id = match[1];
  } else if (regexChannel.test(link)) {
    const match = link.match(regexChannel);
    id = match[1];
  } else {
    await conn.sendMessage(m.chat, { 
      text: 'Por favor, proporciona un enlace válido de grupo o canal de WhatsApp.' 
    });
    return;
  }

  try {
    let info;
    if (regexGroup.test(link)) {
      info = await conn.groupAcceptInvite(id);
    } else {
      info = { id }; // Canales no requieren aceptar invitación.
    }

    await conn.sendMessage(m.chat, { 
      text: `El ID del grupo/canal es: \n\n*${info.id}*` 
    });
  } catch (e) {
    await conn.sendMessage(m.chat, { 
      text: 'No se pudo obtener información del grupo/canal. Asegúrate de que el enlace sea válido y el bot tenga acceso.' 
    });
    console.error(e);
  }
};

handler.help = ['id'];
handler.tags = ['tools'];
handler.command = /^id/i;

export default handler;

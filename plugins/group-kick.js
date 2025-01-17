let handler = async (m, { conn, participants, usedPrefix, command, isROwner }) => {
    let kickte = `🚩 Menciona al usuario que deseas eliminar.`;

    if (!m.mentionedJid[0] && !m.quoted) 
        return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) });

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
    let ownerJid = m.chat.split`-`[0] + '@s.whatsapp.net';  // Asegurándonos de que esté el formato correcto

    // Debug: Verificar los JID
    console.log("Owner JID:", ownerJid);
    console.log("User to be kicked:", user);

    // Verifica si el usuario es el creador (owner) del grupo
    if (user === ownerJid) {
        return conn.reply(m.chat, `🚩 No puedo eliminar al propietario del grupo porque es mi creador.`, null, { mentions: [user] });
    }

    // Eliminar al usuario
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove'); 

    // Solo se envían los mensajes si el usuario no es el propietario
    await m.reply(`🚩 Usuario eliminado.`, m.chat, { mentions: [user] });
    m.reply(`Lo siento, acabas de ser eliminado del grupo.`, user);
};

handler.help = ['kick *@user*'];
handler.tags = ['group'];
handler.command = ['kick', 'expulsar'];
handler.admin = true;
handler.group = true; 
handler.botAdmin = true;

export default handler;

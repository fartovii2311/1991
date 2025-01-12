let handler = m => m;

handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner }) {
  if (!m.isGroup) return !1;

  if (!isBotAdmin) return;

  let chat = global.db.data.chats[m.chat];

  const allEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌',
    '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭',
    '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔',
    '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😵', '🤯', '🤠', '🥳', '😎',
    '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨',
    '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡',
    '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖',
    '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙌', '👏', '👋', '🤚', '🖐️',
    '✋', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '👍', '👎', '✊',
    '👊', '🤛', '🤜', '👏', '🙇‍♂️', '🙇‍♀️', '🙏', '💪', '🦾', '👀', '👁️', '👄', '💋',
    '🧠', '🫀', '🫁', '🗣️', '👤', '👥', '🫂', '👣', '🐵', '🙈', '🙉', '🙊', '🐶', '🐱',
    '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦄', '🐴', '🐗', '🐷', '🐽', '🐖', '🐄', '🐕',
    '🐓', '🐥', '🦜', '🦢', '🐢', '🐍', '🐲', '🐉', '🦕', '🦖', '🐙', '🦀', '🦞', '🦐',
    '🦑', '🐡', '🐠', '🐟', '🐬', '🐳', '🦈', '🐋', '🦭', '🐊', '🐅', '🐆', '🦓', '🦍',
    '🦧', '🐘', '🦛', '🦏', '🦣', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎',
    '🐖', '🐐', '🦙', '🐏', '🐑', '🦌', '🦫', '🐀', '🐁', '🐭', '🐹', '🐇', '🦡', '🦦',
    '🦨', '🦘', '🦥', '🦅', '🦆', '🦢', '🦉', '🦇', '🐍', '🐢', '🦎', '🦕', '🦖', '🐙'
  ];

  const randomEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];

  try {
    await conn.react(m.chat, m.key, randomEmoji);
  } catch (err) {
    console.error('Error al enviar reacción:', err);
  }

  return !0; // Continuar con el flujo del handler
};

export default handler;

// alert();

const container = document.querySelector(".container");
const COMMANDS_URL = "http://127.0.0.1:5501/src/commands/";
(async () => {
  const res = await fetch(COMMANDS_URL);
  const text = await res.text();

  const categories = getNameMatches(text);
  const categoriesObject = {};
  for (const category of categories) {
    const res = await fetch(COMMANDS_URL + category);
    const text = await res.text();
    const commands = getNameMatches(text);
    categoriesObject[category] = [];

    for (const command of commands) {
      const res = await fetch(COMMANDS_URL + category + "/" + command);
      const text = await res.text();

      const name =
        text.match(/name: '(.*)',/) && text.match(/name: '(.*)',/)[1];
      const description = text.match(/description:\s*'(.*)',/)[1];
      const aliases = text
        .match(/aliases:\s*\[(.*)\],/)[1]
        .replace(/'/g, "")
        .split(/,\s*/);
      const cooldown = text.match(/cooldown:\s*(.*),/)[1];
      const usage = text.match(/usage:\s*'(.*)',/)[1];
      const examples = text
        .match(/examples:\s*\[(.*?)\],/s)[1]
        .replace(/'/g, "")
        .split(/,\s*/)
        .map((e) => e.trim())
        .filter((e) => e !== "");
      const guildOnly = !!text.match(/guildOnly:\s*(.*),/);
      const restricted = !!text.match(/restricted:\s*(.*),/);

      categoriesObject[category].push({
        name,
        description,
        aliases,
        cooldown,
        usage,
        examples,
        guildOnly,
        restricted,
      });
    }
  }

  Object.keys(categoriesObject)
    .sort()
    .forEach((category) => {
      container.innerHTML += `<h3>${title(category)}</h3>`;
      const template = `<table>
    <thead>
      <tr>
      ${Object.keys(categoriesObject[category][0]).map(
        (key) => `<th>${key}</th>`
      ).join``}
      </tr>
    </thead>
    <tbody>
    ${categoriesObject[category].map((command) => {
      return `<tr>${Object.keys(command).map((key) => {
        if (key === "aliases" || key === "examples") {
          return `<td>${command[key]
            .filter((e) => e !== "")
            .map((e) => `<div>${e}</div>`).join``}</td>`;
        }
        return `<td>${
          command[key] === true
            ? '<i class="fas fa-check-circle"></i>'
            : command[key] === false
            ? '<i class="fas fa-times-circle"></i>'
            : typeof command[key] === "string"
            ? command[key].replace("\\", "")
            : command[key]
        }</td>`;
      }).join``}</tr>`;
    }).join``}
    </tbody>
  </table>`;
      container.innerHTML += template;
    });
})();

function getNameMatches(text) {
  return [
    ...text.matchAll(/<span class="name">([a-z-]*?(?:\.js)?)<\/span>/g),
  ].map((match) => match[1]);
}

function title(words) {
  return words.split`-`.map((word) => word[0].toUpperCase() + word.slice(1))
    .join` `;
}

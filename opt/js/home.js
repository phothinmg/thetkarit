import showdown from "https://cdn.jsdelivr.net/npm/showdown@2.1.0/+esm";
import * as shiki from "https://cdn.jsdelivr.net/npm/shiki@3.1.0/+esm";
function decodeHtml(encodedString) {
  var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  var translate = {
    nbsp: " ",
    amp: "&",
    quot: '"',
    lt: "<",
    gt: ">",
  };
  return encodedString
    .replace(translate_re, function (match, entity) {
      return translate[entity];
    })
    .replace(/&#(\d+);/gi, function (match, numStr) {
      var num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
}
const hlter = await shiki.createHighlighter({
  langs: Object.keys(shiki.bundledLanguages),
  themes: Object.keys(shiki.bundledThemes),
});

function shiki_hl(code, lang) {
  return hlter.codeToHtml(code, {
    lang: lang,
    themes: { light: "github-light", dark: "github-dark" },
  });
}

showdown.extension = function showdownShiki() {
  function filter(text, converter, options) {
    const params = {
      left: "<pre><code\\b[^>]*>",
      right: "</code></pre>",
      flags: "g",
    };
    function replacement(wholeMatch, match, left, right) {
      const _match = decodeHtml(match);
      const regex = /class=\"([^ \"]+)/;
      const lan = left.match(regex)?.[1] || "";
      if (!lan || lan === "") {
        return wholeMatch;
      }

      return shiki_hl(_match, lan);
    }
    return showdown.helper.replaceRecursiveRegExp(
      text,
      replacement,
      params.left,
      params.right,
      params.flags
    );
  }
  return [
    {
      type: "output",
      filter: filter,
    },
  ];
};

//showdown.extension("showdown-shiki", showdownShiki());

const options = {
  emoji: true,
  ghCodeBlocks: true,
  parseImgDimensions: true,
  simplifiedAutoLink: true,
  tables: true,
  tasklists: true,
  completeHTMLDocument: false,
  headerLevelStart: 1,
  ellipsis: true,
  encodeEmails: true,
  metadata: false,
  openLinksInNewWindow: true,
  strikethrough: true,
  extensions: [showdownShiki],
};

const con = new showdown.Converter(options);
export function converter(text) {
  return con.makeHtml(text);
}
fetch("./home.md")
  .then((res) => res.text())
  .then((content) => {
    document.getElementById("content").innerHTML = converter(content);
  });

function cutUnvantedCharacters(input) {
  if (!input || input == "") {
      return "";
  }
  const unvantedCharactersRegExp = new RegExp(
    '[<>%|]'
  );
  return input.replace(unvantedCharactersRegExp, "");
}
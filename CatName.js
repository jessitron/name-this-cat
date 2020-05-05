
const CHARACTERS_THAT_FIT_ON_THE_PICTURE = 30;

class CatName {
  constructor(nameText) {
    if (!/[a-zA-Z]/.test(nameText)) {
      throw new Error("A cat name contains letters");
    }
    if (nameText.length > CHARACTERS_THAT_FIT_ON_THE_PICTURE) {
      throw new Error("That name is too long. It won't fit.")
    }
    this.text = nameText;
  }
}

module.exports = CatName;
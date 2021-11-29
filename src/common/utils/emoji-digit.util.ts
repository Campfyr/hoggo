export class EmojiDigitUtil {
    protected emojiDigits: Map<number, string>;

    constructor() {
        this.emojiDigits = new Map();
        this._initializeEmojis();
    }

    private _initializeEmojis(): void {
        this.emojiDigits.set(0, '0️⃣');
        this.emojiDigits.set(1, '1️⃣');
        this.emojiDigits.set(2, '2️⃣');
        this.emojiDigits.set(3, '3️⃣');
        this.emojiDigits.set(4, '4️⃣');
        this.emojiDigits.set(5, '5️⃣');
        this.emojiDigits.set(6, '6️⃣');
        this.emojiDigits.set(7, '7️⃣');
        this.emojiDigits.set(8, '8️⃣');
        this.emojiDigits.set(9, '9️⃣');
    }

    public convertDigitToEmoji(digit: number): string {
        const digitString = digit.toString();
        const emojis = [];
        for (let i = 0; i < digitString.length; i++) {
            const char = digitString.charAt(i);
            const emoji = this.emojiDigits.get(parseInt(char));
            emojis.push(emoji);
        }
        return emojis.join('');
    }
}

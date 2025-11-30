export class HangulUtil {
  private static readonly CHO = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
  ];

  private static readonly JUNG = [
    'ㅏ',
    'ㅐ',
    'ㅑ',
    'ㅒ',
    'ㅓ',
    'ㅔ',
    'ㅕ',
    'ㅖ',
    'ㅗ',
    'ㅘ',
    'ㅙ',
    'ㅚ',
    'ㅛ',
    'ㅜ',
    'ㅝ',
    'ㅞ',
    'ㅟ',
    'ㅠ',
    'ㅡ',
    'ㅢ',
    'ㅣ',
  ];

  private static readonly JONG = [
    '',
    'ㄱ',
    'ㄲ',
    'ㄳ',
    'ㄴ',
    'ㄵ',
    'ㄶ',
    'ㄷ',
    'ㄹ',
    'ㄺ',
    'ㄻ',
    'ㄼ',
    'ㄽ',
    'ㄾ',
    'ㄿ',
    'ㅀ',
    'ㅁ',
    'ㅂ',
    'ㅄ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
  ];

  // 한글 분해
  static disassemble(
    char: string,
  ): { cho: string; jung: string; jong: string } | null {
    const code = char.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return null;

    const cho = Math.floor(code / 588);
    const jung = Math.floor((code % 588) / 28);
    const jong = code % 28;

    return {
      cho: this.CHO[cho],
      jung: this.JUNG[jung],
      jong: this.JONG[jong],
    };
  }

  // 한글 조합
  static assemble(cho: string, jung: string, jong: string = ''): string {
    const choIndex = this.CHO.indexOf(cho);
    const jungIndex = this.JUNG.indexOf(jung);
    const jongIndex = this.JONG.indexOf(jong);

    if (choIndex === -1 || jungIndex === -1 || jongIndex === -1) return '';

    return String.fromCharCode(
      0xac00 + choIndex * 588 + jungIndex * 28 + jongIndex,
    );
  }

  // 초성인지 확인
  static isChosung(char: string): boolean {
    return this.CHO.includes(char);
  }

  // 검색 패턴 생성
  static createSearchPattern(input: string): string {
    let pattern = '';

    for (const char of input) {
      // 초성만 입력된 경우 (예: ㅊ)
      if (this.isChosung(char)) {
        const choIndex = this.CHO.indexOf(char);
        const startChar = String.fromCharCode(0xac00 + choIndex * 588);
        const endChar = String.fromCharCode(0xac00 + choIndex * 588 + 587);
        pattern += `[${startChar}-${endChar}]`;
        continue;
      }

      const disassembled = this.disassemble(char);

      if (disassembled) {
        // 완성된 한글인 경우
        if (disassembled.jong) {
          // 종성까지 있으면 정확히 일치
          pattern += char;
        } else {
          // 종성이 없으면 종성 올 수 있는 모든 경우
          const baseChar = this.assemble(
            disassembled.cho,
            disassembled.jung,
            '',
          );
          const endChar = this.assemble(
            disassembled.cho,
            disassembled.jung,
            'ㅎ',
          );
          pattern += `[${baseChar}-${endChar}]`;
        }
      } else {
        // 한글이 아닌 경우
        pattern += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 정규식 특수문자 이스케이프
      }
    }

    return pattern;
  }
}

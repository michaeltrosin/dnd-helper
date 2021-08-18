export function hash(data: string): number {
    let result = 7;
    for (let i = 0; i < data.length; i++) {
        result = result * 31 + data.charCodeAt(i);
    }
    return result;
}

export function classes(...cls: string[]): string {
    return cls.join(' ').trim();
}

export function multiline(...text: string[]): string {
    return text.join('\n').trim();
}

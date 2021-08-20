export const sum = (xs: number[]) => xs.reduce((x,y) => x+y, 0);

export const count = (xs: number[]) => xs.length;

export const avg = (xs: number[]) => sum(xs) / count(xs);

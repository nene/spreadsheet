// Immutable updating key in Object
export const updateMap = <K extends string | number | symbol,V>(key: K, value: V, map: Record<K,V>): Record<K,V> => {
  return {...map, [key]: value};
};

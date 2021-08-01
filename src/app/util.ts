// Immutable updating key in Map
export const updateMap = <K,V>(key: K, value: V, map: Map<K,V>): Map<K,V> => {
  const newMap = new Map(map);
  newMap.set(key, value);
  return newMap;
};

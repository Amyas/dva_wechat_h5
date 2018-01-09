export function GetQueryString(name, search) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

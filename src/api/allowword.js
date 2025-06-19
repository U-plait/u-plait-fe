import api from "./api";

const ALLOWWORD_URL = "/admin/allowword";

export const fetchAllowWords = ({ page = 0, keyword = "" }) => {
  const params = new URLSearchParams();
  params.append("page", page);
  if (keyword) params.append("keyword", keyword);

  const url = `/admin/allowword${keyword ? "/search" : ""}?${params.toString()}`;
  return api.get(url);
};

export const addAllowWord = async (word) => {
  return await api.post(ALLOWWORD_URL, { allowWord: word });
};

export const deleteAllowWord = async (id) => {
  return await api.delete(`${ALLOWWORD_URL}/${id}`);
};

export const deleteAllowWordsBulk = async (ids) => {
  return await api.delete(ALLOWWORD_URL, { data: ids });
};
import api from "./api";

const BANWORD_URL = "/admin/banword";

export const fetchBanWords = ({ page = 0, keyword = "" }) => {
  const params = new URLSearchParams();
  params.append("page", page);
  if (keyword) params.append("keyword", keyword);

  const url = `/admin/banword${keyword ? "/search" : ""}?${params.toString()}`;
  return api.get(url);
};

export const addBanWord = async (word) => {
  return await api.post(BANWORD_URL, { banWord: word });
};

export const deleteBanWord = async (id) => {
  return await api.delete(`${BANWORD_URL}/${id}`);
};

export const deleteBanWordsBulk = async (ids) => {
  return await api.delete(BANWORD_URL, { data: ids });
};